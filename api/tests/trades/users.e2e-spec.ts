import * as faker from 'faker';
import { FastifyInstance } from 'fastify';
import {
  clearDatabase,
  createApp
} from "../util";
import { getConnection } from 'typeorm';
import { UserEntity } from '../../src/users/entities/user.entity';

describe('Users module', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp();
    await clearDatabase(getConnection());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Users Controller', () => {
    let user: UserEntity;

    beforeAll(async () => {
      user = (await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          "name": faker.finance.currencyCode(),
        }
      })).json();
    });

    describe('POST /trades', () => {
      it('should return status 201 and create Trade', async() => {
        const payload = {
          name: faker.finance.currencyCode(),
        };
        const response = await app.inject({
            method: 'POST',
            url: '/users',
            payload
          });

        const responseJson = response.json();
        expect(response.statusCode).toBe(201);
        expect(responseJson.id).toBeTruthy();
        expect(responseJson.name).toEqual(payload.name);
      });
      
      it('should return status 400 with bad payload', async() => {
        const response = await app.inject({
            method: 'POST',
            url: '/users',
            payload: {}
          });

        expect(response.statusCode).toBe(400);
      });
    });

    describe('GET /users/:user_id', () => {
      it('should return status 200 and fetch User', async() => {
        const response = await app.inject({
            method: 'GET',
            url: `/users/${user.id}`,
          });

        const responseJson = response.json();
        expect(response.statusCode).toBe(200);
        expect(responseJson.id).toEqual(user.id);
      });

      it('should return status 400 for bad user id', async() => {
        const response = await app.inject({
            method: 'GET',
            url: `/users/bad-user-id`,
          });

        expect(response.statusCode).toBe(400);
      });

      it('should return status 400 for non-existent user id', async() => {
        const response = await app.inject({
            method: 'GET',
            url: `/users/${faker.datatype.uuid()}`,
          });

        expect(response.statusCode).toBe(404);
      });
    });

    describe('GET /users', () => {
      it('should return status 200 and fetch many User', async() => {
        const response = await app.inject({
            method: 'GET',
            url: `/users`,
          });

        const responseJson = response.json();
        expect(response.statusCode).toBe(200);
        expect(responseJson.length > 0).toEqual(true);
      });
    });
  });
});
