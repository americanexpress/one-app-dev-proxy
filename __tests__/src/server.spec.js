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

import cors from 'cors';
import applyCustomMiddleware from '../../src/applyCustomMiddleware';
import createServer from '../../src/server';

jest.mock('express', () => jest.fn(() => ({ use: jest.fn(), isExpressServer: true })));
jest.mock('cors', () => jest.fn(require.requireActual('cors')));
jest.mock('../../src/applyCustomMiddleware');

describe('server', () => {
  describe('createServer', () => {
    beforeEach(() => {
      cors.mockClear();
      applyCustomMiddleware.mockClear();
    });

    it('should return an express application', () => {
      expect(createServer().isExpressServer).toBe(true);
    });

    it('should enable cors', () => {
      const app = createServer();
      expect(app.use.mock.calls[0][0].name).toBe('corsMiddleware');
    });

    it('should allow cors for all origins', () => {
      createServer();
      const originValidator = cors.mock.calls[0][0].origin;
      const origins = [
        'http://localhost:3000',
        'http://localhost:3002',
        'http://10.10.100.10:3000',
      ];
      const callback = (err, valid) => valid;
      origins.forEach((origin) => {
        expect(originValidator(origin, callback)).toBe(true);
      });
    });

    it('should not apply middleware if useMiddleware option is false', () => {
      createServer({ useMiddleware: false });
      expect(applyCustomMiddleware).not.toHaveBeenCalled();
    });

    it('should not apply middleware if pathToMiddleware option is undefined', () => {
      createServer({ useMiddleware: true });
      expect(applyCustomMiddleware).not.toHaveBeenCalled();
    });

    it('should set up pipes for each remote', () => {
      const app = createServer({
        remotes: {
          api: 'https://api.com',
          'another-api': 'https://other-api.com',
        },
      });
      expect(app.use).toHaveBeenCalledTimes(4);
      expect(app.use).toHaveBeenCalledWith('/api', expect.any(Function));
      expect(app.use).toHaveBeenCalledWith('/another-api', expect.any(Function));
    });

    it('allows remote to have / prefix', () => {
      const app = createServer({
        remotes: {
          '/another-api': 'https://other-api.com',
        },
      });
      expect(app.use).toHaveBeenCalledWith('/another-api', expect.any(Function));
    });

    it('should apply middleware if useMiddleware option is true and middleware path is defined', () => {
      const pathToMiddleware = 'test/dev/';
      const app = createServer({ useMiddleware: true, pathToMiddleware });
      expect(applyCustomMiddleware).toHaveBeenCalledWith(app, pathToMiddleware);
    });

    it('should not set up pipes if middleware is applied', () => {
      const pathToMiddleware = 'test/dev/';
      const app = createServer({ useMiddleware: true, pathToMiddleware });
      expect(app.use).toHaveBeenCalledTimes(1);
      expect(app.use.mock.calls[0][0].name).toBe('corsMiddleware');
    });
  });
});
