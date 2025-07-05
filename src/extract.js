import fs from 'fs';
import path from 'path';
import { Parser, Language } from 'web-tree-sitter';

const MOVE_DIR = './random_nft/sources';
const WASM_DIR = './node_modules/@mysten/prettier-plugin-move/tree-sitter-move.wasm';

async function extractFromFile(filePath, parser) {
  const code = fs.readFileSync(filePath, 'utf8');
  const tree = parser.parse(code);
  const rootNode = tree.rootNode;

  const moduleNode = rootNode.descendantsOfType('module_definition')[0];
  const moduleIdentity = moduleNode?.childForFieldName('module_identity');
  const address = moduleIdentity?.childForFieldName('address')?.text ?? 'unknown';
  const module = moduleIdentity?.childForFieldName('module')?.text ?? 'unknown';
  const moduleName = `${address}::${module}`;

  const functions = rootNode.descendantsOfType('function_definition').map((fn) => {
    const name = fn.childForFieldName('name')?.text ?? '(anonymous)';
    const paramList = fn.childForFieldName('parameters');

    const params = paramList?.namedChildren.map(param => {
      const name = param.childForFieldName('name')?.text ?? '';
      const typeNode = param.childForFieldName('type');
      const type = typeNode?.text ?? '';
      return { name, type };
    }) ?? [];

    const returnNode = fn.childForFieldName('return_type');
    const returnTypeNode = returnNode?.namedChildren?.[0];
    const returnType = returnTypeNode?.text ?? null;

    return { name, params, return: returnType };
  });

  return { moduleName, functions };
}

(async () => {
  await Parser.init();
  const parser = new Parser();
  const MoveLang = await Language.load(WASM_DIR);
  parser.setLanguage(MoveLang);

  const result = {};

  const files = fs.readdirSync(MOVE_DIR).filter(f => f.endsWith('.move'));

  for (const file of files) {
    const fullPath = path.join(MOVE_DIR, file);
    const { moduleName, functions } = await extractFromFile(fullPath, parser);
    result[moduleName] = functions;
  }

  console.log(JSON.stringify(result, null, 2));
})();
