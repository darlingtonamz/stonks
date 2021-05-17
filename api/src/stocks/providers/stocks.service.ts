import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { Initializer, Service } from 'fastify-decorators';
import { StockEntity } from '../entities/stock.entity';
import { ConnectionService } from '../../db/providers/connection.service';
import { endOfDay, format, parse } from 'date-fns';
import { CreateStockDTO } from '../dtos/stock.dto';

interface IStartEndTimeString {
  start?: string| undefined;
  end?: string | undefined;
}

@Service()
export class StocksService {
  private repository!: Repository<StockEntity>;
  constructor(private connectionService: ConnectionService) {}

  @Initializer([ConnectionService])
  async init(): Promise<void> {
    this.repository = this.connectionService.connection.getRepository(StockEntity);
  }
  
  public async getOneStock(query: FindConditions<StockEntity>, options?: FindOneOptions): Promise<StockEntity> {
    let stock: StockEntity | undefined;
    try {
      stock = await this.repository.findOne(query, options);
    } catch (e) {
      throw { statusCode: 500, message: e }
    }
    if (!stock) {
      throw { statusCode: 404, message: `Stock ${JSON.stringify(query)} not found` }
    }
    return stock;
  }

  // Create one Stock
  public async createOneStock(
    body: CreateStockDTO,
  ): Promise<StockEntity> {
    const existingStock = await this.repository.findOne({ symbol: body.symbol });
    if (existingStock) {
      throw {
        statusCode: 400,
        message: `Stock with the same symbol (${body.symbol}) already exists`,
      }
    }
    return this.repository.save(
      this.repository.merge(new StockEntity(), body)
    );
  }

  validateStartEndDataString(
    start?: string, end?: string
  ): IStartEndTimeString {

    try {
      start = start ? format(parse(start, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd HH:mm:ss') : undefined;
      end = end ? format(endOfDay(parse(end, 'yyyy-MM-dd', new Date())), 'yyyy-MM-dd HH:mm:ss') : undefined;
      
      if (start && end) {
        const startTime = parse(
          start,
          'yyyy-MM-dd HH:mm:ss', new Date()
        );
        const endTime = parse(end,
          'yyyy-MM-dd HH:mm:ss', new Date()
        );

        if (startTime > endTime) {
          throw new Error('Invalid time range')
        }
      }
    } catch (error) {
      switch (error.message) {
        case 'Invalid time value':
          throw {
            statusCode: 400,
            message: `Invalid time value | start(${start}) or end(${end}) | Accepted format: 'yyyy-MM-dd' `,
          }
        case 'Invalid time range':
          throw {
            statusCode: 400,
            message: `Invalid time range | 'start'(${start}) must be less that 'end'(${end})`,
          }      
        default:
          break;
      }
    }
    return { start, end };
  }

  public async getPeriodHighLowStockPrices(
    symbol: string,
    start?: string,
    end?: string
  ): Promise<{symbol?: string, highest?: string, lowest?: string, message?: string}> {
    // Using this to verify if the Stock exists
    await this.getOneStock({ symbol });

    let startEndObj: IStartEndTimeString = this.validateStartEndDataString(start, end);
    start = startEndObj.start;
    end = startEndObj.end;

    let query = `SELECT price
      FROM trades 
      WHERE
        symbol = $1`;
    let params = [symbol];

    if (start && end) {
      query = `SELECT price
        FROM trades 
        WHERE
          symbol = $1 AND timestamp >= $2 AND timestamp <= $3`;
      params = [symbol, start, end];
    } else if (start) {
      query = `SELECT price
        FROM trades 
        WHERE
          symbol = $1 AND timestamp >= $2`;
      params = [symbol, start];
    } else if (end) {
      query = `SELECT price
        FROM trades 
        WHERE
          symbol = $1 AND timestamp <= $2`;
      params = [symbol, end];
    }

    const prices = (
        await this.repository.query(query, params)
      )
      .map((obj: {price: number}) => obj.price)
      .sort((a: number, b: number) => a - b);

    if (prices.length > 0) {
      const [lowest, highest] = [prices[0], prices[prices.length - 1]];
      return { symbol, highest, lowest }
      
    } else {
      return {
        message: "There are no trades in the given date range"
      }
    }
  }

  public async getStockStats(
    start?: string,
    end?: string,
  ): Promise<any[]> {
    let startEndObj: IStartEndTimeString = this.validateStartEndDataString(start, end);
    start = startEndObj.start;
    end = startEndObj.end;
    const stockTradesMap: {[key: string] : {symbol: string, price: number}[]} = {}

    const stocks = await this.repository.query(`SELECT stocks.symbol FROM stocks`);

    stocks.forEach((stock: { symbol: string }) => {
      stockTradesMap[stock.symbol] = [];
    });

    let trades = [];
    try {
      trades = await this.repository.query(`SELECT symbol, price
          FROM trades 
          WHERE
            timestamp >= $1 AND timestamp <= $2
          ORDER BY timestamp ASC, created_at
        `, [start, end]);  
    } catch (error) {
      throw {
        statusCode: 500,
        message: error,
      }
    }

    if (trades.length > 0) {
      trades.forEach((trade: {symbol: string, price: number}) => {
        if (!stockTradesMap[trade.symbol]) {
          stockTradesMap[trade.symbol] = [];
        }
        stockTradesMap[trade.symbol].push(trade);
      });
    }

    const output = [];
    for (const symbol in stockTradesMap) {
      let fluctuations = 0;
      const trades = stockTradesMap[symbol];
      if (trades && trades.length > 0) {
        let currentTrajectory = 'STABLE';
        let prevPrice: number = -1;
        let maxRise = 0;
        let maxFall = 0;
  
        for (const { price: currentPrice } of trades) {
          let newTrajectory = currentTrajectory;
          if (prevPrice != -1) {
            const priceDiff = currentPrice - prevPrice;
            const absPriceDiff = Math.abs(priceDiff);
            if (priceDiff > 0 && currentTrajectory != 'ASC') {
              newTrajectory = 'ASC';
              maxRise = absPriceDiff > maxRise ? absPriceDiff : maxRise;
            } else if (priceDiff < 0 && currentTrajectory != 'DESC') {
              newTrajectory = 'DESC';
              maxFall = absPriceDiff > maxFall ? absPriceDiff : maxFall;
            }
          }

          if (
            currentTrajectory != 'STABLE' &&
            currentTrajectory != newTrajectory
          ) {
            fluctuations += 1;
          }
          currentTrajectory = newTrajectory;
          prevPrice = currentPrice;
        }
        
        output.push({
          stock: symbol,
          fluctuations,
          'max_rise': Math.round(maxRise * 100) / 100,
          'max_fall': Math.round(maxFall * 100) / 100,
        });
      } else {        
        output.push({
          stock: symbol,
          message: "There are no trades in the given date range",
        });
      }
    }

    return output;
  }
}