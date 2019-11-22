#!/usr/bin/env node
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

/* istanbul ignore next */
/**
* Copy /mocks from module into axp-app for use within parrot-middlware
* >  npm run mock:api ../path/to/module
* Module must have a /mock folder with a index.js file inside.
*/
const {
  addDevFolder,
  clearCachedMiddleware,
  createSymLinks,
} = require('./utils/setMiddlewareUtils');

addDevFolder()
  .then(clearCachedMiddleware)
  .then(createSymLinks)
  .then(() => console.log('Successfully linked dev middleware to app'))
  .catch((e) => console.error(`Error:  Unable to create middleware from provided file.
      Reason: ${e}`));
