"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loadtest = require("loadtest");
const dotenv = require("dotenv");
dotenv.config();
const opts = {
    concurrency: 1,
    headers: {
        Authorization: `${process.env.API_KEY}`,
    },
    insecure: true,
    method: 'GET',
    maxRequests: 5,
    requestPerSecond: 1,
    timeout: 3000,
    url: `${process.env.TEST_BASE_URL}/`
};
loadtest.loadTest(opts, (error, result) => {
    if (error)
        return console.error('Got an error: %s', error);
    console.log('Tests run sucessfull:', result);
});
//# sourceMappingURL=server.load.js.map