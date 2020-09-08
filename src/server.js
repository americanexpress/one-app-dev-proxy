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

import express from 'express';
import cors from 'cors';

import applyCustomMiddleware from './applyCustomMiddleware';
import {
  setRemoteUrl,
  pipe,
} from './middleware';

export default function createServer({
  pathToMiddleware,
  remotes = {},
  useMiddleware = false,
} = {}) {
  const app = express();

  app.use(cors({
    // Because '*' is not allowed when using credentials: 'include'
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }));

  if (useMiddleware && pathToMiddleware) {
    applyCustomMiddleware(app, pathToMiddleware);
  } else {
    Object.keys(remotes).forEach((remote) => {
      app.use(`/${remote}`, setRemoteUrl(remotes[remote]));
    });
    app.use(pipe());
  }
  return app;
}
