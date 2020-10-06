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

import request from 'request';
import chalk from 'chalk';
import {
  setRemoteUrl,
  pipe,
} from '../../src/middleware';

jest.mock('request');
jest.mock('chalk', () => ({ red: jest.fn((s) => `<red>${s}</red>`) }));

describe('setRemoteUrl', () => {
  it('should build the remote URL for the request and attach it to the request', () => new Promise((done) => {
    const remoteBaseUrl = 'https://my-app.com';
    const req = {
      originalUrl: '/api/test',
      baseUrl: '/api',
    };
    const next = () => {
      expect(req.remoteUrl).toBe('https://my-app.com/test');
      done();
    };
    setRemoteUrl(remoteBaseUrl)(req, undefined, next);
  }));
});

describe('pipe', () => {
  const req = {
    headers: { origin: 'foo', referer: 'bar' },
    method: 'POST',
    remoteUrl: 'https://api.com/v1/data',
    pipe: jest.fn((s) => s),
  };
  const res = { data: 'data' };

  beforeEach(() => {
    request.__resetRequests(); // eslint-disable-line no-underscore-dangle
    request.mockClear();
    req.pipe.mockClear();
  });

  it('should delete the headers origin and referer', () => {
    pipe(false)(req, res);
    expect(req).toMatchSnapshot();
  });

  it('should pipe request', () => {
    pipe(false)(req, res);
    const reqInstance = request.__getRequest(0); // eslint-disable-line no-underscore-dangle
    expect(req.pipe).toBeCalledWith(reqInstance);
  });

  it('should pipe response', () => {
    pipe(false)(req, res);
    const reqInstance = request.__getRequest(0); // eslint-disable-line no-underscore-dangle
    expect(reqInstance.pipe).toBeCalledWith(res);
  });

  it('should show a message when there is a socket error', () => {
    jest.spyOn(console, 'error');
    pipe(false)(req, res);
    const reqInstance = request.__getRequest(0); // eslint-disable-line no-underscore-dangle
    reqInstance.emit('error', new Error('test error like socket timeout'));
    expect(chalk.red).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(console.error.mock.calls[0]).toMatchSnapshot();
  });
});
