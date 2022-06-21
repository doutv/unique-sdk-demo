# A bug when running unique-sdk demo

- nodejs version: 16.15.1
- npm version: 8.11.0

command:
```shell
npm install
npm start
```

```shell
file:///opt/hyj/unique-network/unique-sdk-demo/node_modules/@unique-nft/sdk/types/index.js:1
export { AnyJson, ISubmittableResult, SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
         ^^^^^^^
SyntaxError: The requested module '@polkadot/types/types' does not provide an export named 'AnyJson'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:128:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:385:24)
    at async loadESM (node:internal/process/esm_loader:88:5)
    at async handleMainPromise (node:internal/modules/run_main:61:12)
```
