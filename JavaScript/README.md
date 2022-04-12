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

## Run Test

- Run test

  ```
  $ npm test
  ```

- Run test continuously

  ```
  $ npm run test:watch
  ```

## Reference

- [Jest Getting Started](https://jestjs.io/docs/getting-started)
- [Mocks Aren't Stubs 번역본](https://testing.jabberstory.net/)
