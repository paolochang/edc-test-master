# Jest

## Jest Setup

1. Install `@types/jest` as dev dependency

   ```bash
   $ npm i @types/jest --save-dev
   ```

2. Create `jsconfig.json`

   ```json
   {
     "typeAcquisition": {
       "include": ["jest"]
     }
   }
   ```

## Reference

- [Jest Getting Started](https://jestjs.io/docs/getting-started)
