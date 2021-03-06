# Node

## Initial Setup

1. Install `Jest`, `node-mocks-http`, `@babel/plugin-transform-modules-commonjs` as dev dependencies

   ```sh
   $ npm install --save-dev jest node-mocks-http
   $ npm install --save-dev @babel/plugin-transform-modules-commonjs
   ```

   Jest doesn't support ES6 importing module. Therefore, in order to test with Jest, ES6 module has to be changed to commonjs.

2. Create `.babelrc`

   ```json
   {
     "env": {
       "test": {
         "plugins": ["@babel/plugin-transform-modules-commonjs"]
       }
     }
   }
   ```

## Test Setup

1. Setup `Jest`

   ```sh
   $ jest --init
   ```

2. Create `.env.test`

3. Enable **setupFiles** in `jest.config.mjs`

   ```mjs
   {
     setupFiles: ["dotenv/config"],
   }
   ```

4. Setup **test scrtips** in `package.json`

   ```json
   {
     "scripts": {
       "test": "DOTENV_CONFIG_PATH=./.env.test jest --watchAll"
     }
   }
   ```

   In `Windows`, install `cross-env` **(optional)**

   ```sh
   $ npm install --save-dev cross-env
   ```

   ```json
   {
     "scripts": {
       "test": "cross-env DOTENV_CONFIG_PATH=./.env.test jest --watchAll"
     }
   }
   ```

5. Run test

   ```
   $ npm run test
   ```

## Jest CLI Options

### Running from the command line

- Run watch mode:

  ```sh
  $ jest --watch #runs jest -o by default
  $ jest --watchAll #runs all tests
  ```

- Run coverage:

  ```sh
  $ jest --coverage
  ```

  To remove `Node/coverage/lcov-report` on the coverage report

  ```mjs
  export default {
    collectCoverageFrom: [
      "**/*.{js,jsx}",
      "!**/node_modules/**",
      "!**/coverage/**",
    ],
  };
  ```

### Options

- `--init`: Generate a basic configuration file. Based on your project, Jest will ask you a few questions that will help to generate a jest.config.js file with a short description for each option.
- `--verbose`: Display individual test results with the test suite hierarchy.
