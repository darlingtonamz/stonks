import * as faker from 'faker';
import { FastifyInstance } from 'fastify';
import {
  clearDatabase,
  createApp
} from "../util";
import { getConnection } from 'typeorm';
import { TradeType } from '../../src/common/constants/constants';
import { StockEntity } from '../../src/stocks/entities/stock.entity';
import { UserEntity } from '../../src/users/entities/user.entity';

describe('Stocks module', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp();
    await clearDatabase(getConnection());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Stocks Controller', () => {
    let existingStock: StockEntity;
    let user: UserEntity;

    beforeAll(async () => {
      user = (await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          "name": faker.random.word(),
        }
      })).json();

      existingStock = (await app.inject({
        method: 'POST',
        url: '/stocks',
        payload: {
          symbol: faker.random.word().toUpperCase(),
        }
      })).json();
    });

    describe('POST /trades', () => {
      it('should return status 201 and create Trade', async() => {
        const payload = {
          symbol: faker.random.word().toUpperCase(),
        };
        const response = await app.inject({
          method: 'POST',
          url: '/stocks',
          payload,
        });

        const responseJson = response.json();
        expect(response.statusCode).toBe(201);
        expect(responseJson.id).toBeTruthy();
        expect(responseJson.symbol).toEqual(payload.symbol);
      });
      
      it('should return status 400 with bad payload', async() => {
        const goodPayload = {
          symbol: faker.random.word().toUpperCase(),
        };
        let response = await app.inject({
          method: 'POST',
          url: '/trades',
          payload: {
            ...goodPayload,
            symbol: false
          },
        });
        expect(response.statusCode).toBe(400);

        response = await app.inject({
          method: 'POST',
          url: '/trades',
          payload: {
            ...goodPayload,
            symbol: existingStock.symbol
          },
        });
        expect(response.statusCode).toBe(400);
      });
    });

    describe('GET /stocks/:stock_symbol/price', () => {
      it('should return status 200 and return many Stock Price', async() => {
      });
    });

    describe('GET /stocks/stats', () => {
      it('should return status 200 and return many Stock stats', async() => {
      });
    });
  });
});
