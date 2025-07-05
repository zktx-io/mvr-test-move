# Move Interface Extractor

This project extracts function signatures (function name, parameter names/types, and return type) from Move smart contract modules.

## Purpose

- Parses `.move` source files and outputs function interfaces in structured JSON.
- Automatically runs on every push to the `main` branch via GitHub Actions.
- Useful for metadata generation in MVR (Move Verifiable Registry) and integration with PTB (Programmable Transaction Block) builders to enhance developer experience.

## Output

You can view the extracted function and parameter names directly in the GitHub Actions [workflow logs](https://github.com/zktx-io/mvr-test-move/actions) after each push.

### Format

The output is printed as a JSON object like this:

```json
{
  "0x2::example_module": [
    {
      "name": "mint_nft",
      "params": [
        { "name": "ctx", "type": "&mut TxContext" }
      ],
      "return": "0x2::random_nft::RandomNFT"
    },
    ...
  ],
  ...
}
```

Explanation of the structure:
 - Keys are fully-qualified module names like 0x2::example_module
 - Each value is a list of function definitions:
 - name: the function name
 - params: a list of parameters, each with name and type
 - return: return type, if present