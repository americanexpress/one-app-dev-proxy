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

const originalProcessCwd = process.cwd;

jest.mock('rimraf');

const mockFs = {
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  symlinkSync: jest.fn(),
  linkSync: jest.fn(),
};
jest.mock('fs', () => mockFs);

function load({
  mockCwd = '/unset/cwd',
  mockArgv = { _: ['../asdf'] },
} = {}) {
  jest.mock('yargs', () => ({ argv: mockArgv }));
  process.cwd = jest.fn(() => mockCwd);

  return require('../../../bin/utils/setMiddlewareUtils');
}

const setExists = ({
  devFolderExists,
  middlewareFolderExists,
  defaultExists = true,
}) => {
  mockFs.existsSync.mockImplementation((path) => {
    const finalPath = path.split('/').pop();
    switch (finalPath) {
      case '.dev':
        return !!devFolderExists;
      case 'middleware':
        return !!middlewareFolderExists;
      default:
        return !!defaultExists;
    }
  });
};

describe('Set Middleware Utils', () => {
  beforeEach(() => {
    // Ignore logs
    jest.spyOn(console, 'log');
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe('addDevFolder', () => {
    it('should add the dev folder if it does not exist', async () => {
      setExists({ devFolderExists: false });
      const { addDevFolder } = load();

      try {
        await addDevFolder();
      } catch (error) {
        throw new Error(error);
      }
      expect(mockFs.mkdirSync).toHaveBeenCalledWith(expect.stringMatching(/.dev/));
    });

    it('should not attempt to create the dev folder if it exists', async () => {
      setExists({ devFolderExists: true });
      const { addDevFolder } = load();

      try {
        await addDevFolder();
      } catch (error) {
        throw new Error(error);
      }
      expect(mockFs.mkdirSync).not.toHaveBeenCalledWith(expect.stringMatching(/.dev/));
    });
  });

  describe('clearCachedMiddleware', () => {
    beforeEach(() => {
      jest.doMock('rimraf', () => jest.fn((path, callback) => callback()));
    });

    it('should not attempt to clear the cache if it does not exist', async () => {
      setExists({ middlewareFolderExists: false });
      const rimraf = require('rimraf');
      const { clearCachedMiddleware } = load();

      try {
        await clearCachedMiddleware();
      } catch (error) {
        throw new Error(error);
      }
      expect(rimraf).not.toHaveBeenCalled();
    });

    it('should clear the cache if it exists', async () => {
      setExists({ middlewareFolderExists: true });
      const rimraf = require('rimraf');
      const { clearCachedMiddleware } = load();

      try {
        await clearCachedMiddleware();
      } catch (error) {
        throw new Error(error);
      }
      expect(rimraf).toHaveBeenCalled();
    });
  });

  describe('createSymLinks', () => {
    it('should create the middleware directory', async () => {
      const { createSymLinks } = load();
      try {
        await createSymLinks();
      } catch (error) {
        throw new Error(error);
      }
      expect(mockFs.mkdirSync).toHaveBeenCalled();
    });

    it('should symlink .dev/middleware directory index to the relative path custom middleware script', async () => {
      const { createSymLinks } = load({
        mockCwd: '/sample/cwd',
        mockArgv: { _: ['../axp-some-module'] },
      });
      try {
        await createSymLinks();
      } catch (error) {
        throw new Error(error);
      }
      expect(mockFs.symlinkSync).toHaveBeenCalledTimes(1);
      expect(mockFs.symlinkSync).toHaveBeenCalledWith(
        '/sample/axp-some-module',
        '/sample/cwd/.dev/middleware/index.js'
      );
    });

    it('should symlink .dev/middleware directory index to absolute path custom middleware script', async () => {
      const { createSymLinks } = load({
        mockCwd: '/sample/cwd',
        mockArgv: { _: ['/abs/path/to/axp-some-module'] },
      });
      try {
        await createSymLinks();
      } catch (error) {
        throw new Error(error);
      }
      expect(mockFs.symlinkSync).toHaveBeenCalledTimes(1);
      expect(mockFs.symlinkSync).toHaveBeenCalledWith(
        '/abs/path/to/axp-some-module',
        '/sample/cwd/.dev/middleware/index.js'
      );
    });

    it('should link .dev/middleware directory for Windows devices', async () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'win32',
      });
      const { createSymLinks } = load();
      try {
        await createSymLinks();
      } catch (error) {
        throw new Error(error);
      }
      expect(mockFs.linkSync).toHaveBeenCalled();
      expect(mockFs.symlinkSync).not.toHaveBeenCalled();
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
    });
  });

  afterAll(() => {
    process.cwd = originalProcessCwd;
  });
});
