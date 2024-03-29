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

const instances = [];

const fetch = jest.fn((url, config) => {
  const reqInstance = {
    mockRequest: true,
    config,
    events: {},
  };
  reqInstance.catch = jest.fn((cb) => {
    const event = 'error';
    reqInstance.events[event] = reqInstance.events[event] || [];
    reqInstance.events[event].push(cb);
    return reqInstance;
  });
  reqInstance.emit = jest.fn((event, data) => {
    (reqInstance.events[event] || []).forEach((cb) => cb(data));
  });
  reqInstance.pipe = jest.fn((s) => Promise.resolve(s));
  instances.push(reqInstance);
  return reqInstance;
});
// eslint-disable-next-line no-underscore-dangle -- this is a mock
fetch.__resetRequests = () => {
  instances.splice(0, Number.POSITIVE_INFINITY);
};
// eslint-disable-next-line no-underscore-dangle -- this is a mock
fetch.__getRequest = (n) => Promise.resolve(instances[n]);
module.exports = fetch;
