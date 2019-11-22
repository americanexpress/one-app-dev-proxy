/*
 * Copyright 2019 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,either express
 * or implied. See the License for the specific language governing permissions and limitations
 * under the License.
 */

import chalk from 'chalk';

export default function applyCustomMiddleware(app, pathToMiddleware) {
  try {
    console.log('Applying custom middleware...');
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const customMiddlewareConfig = require(pathToMiddleware);

    if (typeof customMiddlewareConfig === 'function') {
      customMiddlewareConfig(app);
    } else {
      // doing so in order to support es6 modules using `export default` after they are transpiled
      customMiddlewareConfig.default(app);
    }
  } catch (error) {
    throw new Error(
      `🚨 🚨 🚨 🚨 🚨\n${
        chalk.bold.red(
          'Something went wrong in your dev middleware, '
        + 'did you load it properly? Be sure to run the set-middleware script.\n'
        + 'See error for more information:\n'
        )
      }${chalk.red(error.stack)}`
    );
  }
}
