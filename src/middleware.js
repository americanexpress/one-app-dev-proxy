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

/* eslint-disable no-param-reassign */
import fetch from 'node-fetch';
import chalk from 'chalk';

export const setRemoteUrl = (remoteBaseUrl) => (req, res, next) => {
  req.remoteUrl = `${remoteBaseUrl}${req.originalUrl.slice(req.baseUrl.length)}`;
  next();
};

export const pipe = () => async(req, res) => {
  // avoid copying the request
  delete req.headers.origin;
  delete req.headers.referer;

  const config = {
    method: req.method,
    rejectUnauthorized: false,
  };

  
  return req
    .pipe(
      await fetch(req.remoteUrl,config)
      .catch((err) => {
        console.error(`${chalk.red(`request to ${req.remoteUrl} failed:`)} ${err.message}`);
      })
    )
    .pipe(res);
};
