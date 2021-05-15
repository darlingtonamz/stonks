import { FastifyInstance } from 'fastify';
import {
  clearDatabase,
  createApp
} from "../util";
import { getConnection } from 'typeorm';
import { TradeType } from '../../src/common/constants/constants';
import { StockEntity } from '../../src/stocks/entities/stock.entity';

describe('Abilities Controllers', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp();
    await clearDatabase(getConnection());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Trades Controller', () => {
    let stock: StockEntity;

    beforeAll(async () => {
      stock = (await app.inject({
        method: 'POST',
        url: '/stocks',
        payload: {
          "symbol": "ACM",
        }
      })).json();
    });

    describe('POST /trades', () => {
      it('should return status 201 and create Trade', async() => {
        const payload = {
          type: TradeType.BUY,
          user: {
            id: "vghfghhghg",
            name: "gffggfgfgfgf",
          },
          symbol: stock.symbol,
          shares: 29,
          price: 140,
          timestamp: "2014-06-14 13:13:13"
        };
        const response = await app.inject({
          method: 'POST',
          url: '/trades',
          payload,
        });

        const responseJson = response.json();
        expect(response.statusCode).toBe(201);
        expect(responseJson.id).toBeTruthy();
        expect(responseJson.symbol).toEqual(payload.symbol);
        expect(responseJson.user).toEqual(payload.user);
        expect(responseJson.shares).toEqual(payload.shares);
        expect(responseJson.price).toEqual(payload.price);
        expect(responseJson.timestamp).toEqual(payload.timestamp);
      });
      
      it('should return status 400 with bad payload', async() => {
        const goodPayload = {
          type: TradeType.BUY,
          user: {
            id: "vghfghhghg",
            name: "gffggfgfgfgf",
          },
          symbol: stock.symbol,
          shares: 29,
          price: 140,
          timestamp: "2014-06-14 13:13:13"
        };
        const response = await app.inject({
          method: 'POST',
          url: '/trades',
          payload: {
            ...goodPayload,
            type: 'dffddf'
          },
        });
        console.log({
          json: response.json()
        })
        expect(response.statusCode).toBe(400);
      });
      
      it('should return status 404 with non-existent entity references', async() => {
        const goodPayload = {
          type: TradeType.BUY,
          user: {
            id: "vghfghhghg",
            name: "gffggfgfgfgf",
          },
          symbol: stock.symbol,
          shares: 29,
          price: 140,
          timestamp: "2014-06-14 13:13:13"
        };
        const response = await app.inject({
          method: 'POST',
          url: '/trades',
          payload: {
            ...goodPayload,
            symbol: 'NON-EXISTENT-SYMBOL',
          },
        });
        console.log({
          json: response.json()
        })
        expect(response.statusCode).toBe(404);
      });
    });

    describe('GET /trades', () => {
      it('should return status 200 and return many Trade', async() => {
        const existingTrades = (await app.inject({
          method: 'GET',
          url: '/trades',
        })).json();

        const payload = {
          type: TradeType.BUY,
          user: {
            id: "vghfghhghg",
            name: "gffggfgfgfgf",
          },
          symbol: stock.symbol,
          shares: 29,
          price: 140,
          timestamp: "2014-06-14 13:13:13"
        };
        // Create more Trade
        await app.inject({
          method: 'POST',
          url: '/trades',
          payload,
        });

        const tradesCount = (await app.inject({
          method: 'GET',
          url: '/trades',
        })).json().length;
        expect(tradesCount).toEqual(existingTrades.length + 1);
      });
    });
  });
});
