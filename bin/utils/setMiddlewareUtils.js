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

const path = require('path');
const fs = require('fs');

const { argv } = require('yargs');
const rimraf = require('rimraf');

const PATH_TO_MIDDLEWARE = path.resolve(process.cwd(), argv.path || argv._[0]);
const DEV_DIR = path.join(process.cwd(), '.dev');
const MIDDLEWARE_DIR = path.join(DEV_DIR, 'middleware');

const addDevFolder = () => new Promise((res) => {
  if (!fs.existsSync(DEV_DIR)) {
    fs.mkdirSync(DEV_DIR);
  }
  res();
});

const clearCachedMiddleware = () => new Promise((res) => {
  if (fs.existsSync(MIDDLEWARE_DIR)) {
    rimraf(MIDDLEWARE_DIR, res);
  } else {
    // No existing .middleware folder, continue
    res();
  }
});

const createSymLinks = () => new Promise((res) => {
  fs.mkdirSync(MIDDLEWARE_DIR);
  if (process.platform === 'win32') {
    fs.linkSync(PATH_TO_MIDDLEWARE, `${MIDDLEWARE_DIR}/index.js`);
  } else {
    fs.symlinkSync(PATH_TO_MIDDLEWARE, `${MIDDLEWARE_DIR}/index.js`);
  }
  res();
});

module.exports = {
  addDevFolder,
  clearCachedMiddleware,
  createSymLinks,
};
