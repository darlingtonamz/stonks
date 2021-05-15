import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { Initializer, Service } from 'fastify-decorators';
import { StockEntity } from '../entities/stock.entity';
import { ConnectionService } from '../../db/providers/connection.service';
import { endOfDay, format, parse } from 'date-fns';
import { CreateStockDTO } from '../dtos/stock.dto';

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

  public async getPeriodHighLowStockPrices(
    symbol: string,
    start?: string,
    end?: string
  ): Promise<{symbol?: string, highest?: string, lowest?: string, message?: string}> {
    start = start ? format(parse(start, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd HH:mm:ss') : undefined;
    end = end ? format(endOfDay(parse(end, 'yyyy-MM-dd', new Date())), 'yyyy-MM-dd HH:mm:ss') : undefined;
    const prices = (
        await this.repository.query(`SELECT price
          FROM trades 
          WHERE
            symbol = $1 AND timestamp >= $2 AND timestamp <= $3
        `, [symbol, start, end])
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
    start = start ? format(parse(start, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd HH:mm:ss') : undefined;
    end = end ? format(endOfDay(parse(end, 'yyyy-MM-dd', new Date())), 'yyyy-MM-dd HH:mm:ss') : undefined;
    
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
          ORDER BY timestamp ASC
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
          let newTrajectory = 'STABLE';
          if (prevPrice != -1) {
            const priceDiff = currentPrice - prevPrice;
            const absPriceDiff = Math.abs(priceDiff);
            if (priceDiff > 0) {
              newTrajectory = 'DESC';
              maxFall = absPriceDiff > maxFall ? absPriceDiff : maxFall;
            } else if (priceDiff < 0) {
              newTrajectory = 'ASC';
              maxRise = absPriceDiff > maxRise ? absPriceDiff : maxRise;
            }
            // console.log('############', { currentTrajectory, newTrajectory, priceDiff, absPriceDiff, maxFall, maxRise})
          }
          if (currentTrajectory != newTrajectory) {
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