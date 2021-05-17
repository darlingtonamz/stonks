"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker = require("faker");
const util_1 = require("../util");
const typeorm_1 = require("typeorm");
describe('Users module', () => {
    let app;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = yield util_1.createApp();
        yield util_1.clearDatabase(typeorm_1.getConnection());
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield app.close();
    }));
    describe('Users Controller', () => {
        let user;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            user = (yield app.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    "name": faker.finance.currencyCode(),
                }
            })).json();
        }));
        describe('POST /trades', () => {
            it('should return status 201 and create Trade', () => __awaiter(void 0, void 0, void 0, function* () {
                const payload = {
                    name: faker.finance.currencyCode(),
                };
                const response = yield app.inject({
                    method: 'POST',
                    url: '/users',
                    payload
                });
                const responseJson = response.json();
                expect(response.statusCode).toBe(201);
                expect(responseJson.id).toBeTruthy();
                expect(responseJson.name).toEqual(payload.name);
            }));
            it('should return status 400 with bad payload', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield app.inject({
                    method: 'POST',
                    url: '/users',
                    payload: {}
                });
                expect(response.statusCode).toBe(400);
            }));
        });
        describe('GET /users/:user_id', () => {
            it('should return status 200 and fetch User', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield app.inject({
                    method: 'GET',
                    url: `/users/${user.id}`,
                });
                const responseJson = response.json();
                expect(response.statusCode).toBe(200);
                expect(responseJson.id).toEqual(user.id);
            }));
            it('should return status 400 for bad user id', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield app.inject({
                    method: 'GET',
                    url: `/users/bad-user-id`,
                });
                expect(response.statusCode).toBe(400);
            }));
            it('should return status 400 for non-existent user id', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield app.inject({
                    method: 'GET',
                    url: `/users/${faker.datatype.uuid()}`,
                });
                expect(response.statusCode).toBe(404);
            }));
        });
        describe('GET /users', () => {
            it('should return status 200 and fetch many User', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield app.inject({
                    method: 'GET',
                    url: `/users`,
                });
                const responseJson = response.json();
                expect(response.statusCode).toBe(200);
                expect(responseJson.length > 0).toEqual(true);
            }));
        });
    });
});
//# sourceMappingURL=users.e2e-spec.js.map