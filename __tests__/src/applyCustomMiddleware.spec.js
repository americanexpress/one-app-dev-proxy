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

import applyCustomMiddleware from '../../src/applyCustomMiddleware';

const customMiddlewarePath = '/dev/customMiddleware';
jest.mock('/dev/customMiddleware', () => jest.fn(), { virtual: true });

describe('applyCustomMiddleware', () => {
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => null);
  jest.spyOn(console, 'log').mockImplementation(() => null);
  const app = { use: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should not log a warning when it can load scenarios', () => {
    applyCustomMiddleware(app, customMiddlewarePath);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('should run the custom middleware config if it is an es6 module that has been transpiled down', () => {
    const customMiddlewareConfig = { __esModule: true, default: jest.fn() };
    jest.doMock(customMiddlewarePath, () => customMiddlewareConfig, { virtual: true });
    applyCustomMiddleware(app, customMiddlewarePath);
    expect(customMiddlewareConfig.default).toHaveBeenCalled();
  });

  it('should run the custom middleware config if it is a common module', () => {
    const customMiddlewareConfig = jest.fn();
    jest.doMock(customMiddlewarePath, () => customMiddlewareConfig, { virtual: true });
    applyCustomMiddleware(app, customMiddlewarePath);
    expect(customMiddlewareConfig).toHaveBeenCalled();
  });

  it('should throw when it can\'t load the middleware', () => {
    jest.doMock(customMiddlewarePath, () => { throw new Error('test'); }, { virtual: true });
    expect(() => applyCustomMiddleware(app, customMiddlewarePath)).toThrow();
  });
});
