# Move Interface Extractor

This project extracts function signatures (function name, parameter names/types, and return type) from Move smart contract modules.

## Purpose

- Parses `.move` source files and outputs function interfaces in structured JSON.
- Automatically runs on every push to the `main` branch via GitHub Actions.
- Useful for metadata generation in MVR (Move Verifiable Registry) and integration with PTB (Programmable Transaction Block) builders to enhance developer experience.

## Output

You can view the extracted function and parameter names directly in the GitHub Actions [workflow logs](https://github.com/zktx-io/mvr-test-move/actions) after each push.