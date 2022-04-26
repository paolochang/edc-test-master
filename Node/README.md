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
