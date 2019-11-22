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

const request = jest.fn((config) => {
  const reqInstance = {
    mockRequest: true,
    config,
    events: {},
  };
  reqInstance.on = jest.fn((event, cb) => {
    reqInstance.events[event] = reqInstance.events[event] || [];
    reqInstance.events[event].push(cb);
    return reqInstance;
  });
  reqInstance.emit = jest.fn((event, data) => {
    (reqInstance.events[event] || []).forEach((cb) => cb(data));
  });
  reqInstance.pipe = jest.fn((s) => s);
  instances.push(reqInstance);
  return reqInstance;
});

request.__resetRequests = () => { // eslint-disable-line no-underscore-dangle
  instances.splice(0, Infinity);
};
request.__getRequest = (n) => instances[n]; // eslint-disable-line no-underscore-dangle

module.exports = request;
