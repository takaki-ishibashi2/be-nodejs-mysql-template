"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supertest = require("supertest");
const dotenv = require("dotenv");
dotenv.config();
const request = supertest(process.env.TEST_BASE_URL);
describe('server', () => {
    describe('Get /', () => {
        it('should return 200', done => {
            request.get('/').expect(200, done);
        });
    });
});
//# sourceMappingURL=server.test.js.map