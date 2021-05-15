import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { CreateTradeDTO } from '../dtos/trade.dto';
import { TradeEntity } from '../entities/trade.entity';
import { ConnectionService } from '../../db/providers/connection.service';
import { parse } from 'date-fns';
import { StocksService } from '../../stocks/providers/stocks.service';
// import { FastifyReply } from 'fastify';

@Service()
export class TradesService {
  private repository!: Repository<TradeEntity>;
  
  @Inject(StocksService)
  private stocksService!: StocksService;

  constructor(private connectionService: ConnectionService) {}

  @Initializer([ConnectionService])
  async init(): Promise<void> {
    // because we added ConnectionService as a dependency, we are sure it was properly initialized if it reaches
    // this point
    this.repository = this.connectionService.connection.getRepository(TradeEntity);
  }
  hello(body?: any) {
    return `Hello world! ${JSON.stringify(body)}`;
  }

  public async getOneTrade(query: FindConditions<TradeEntity>, options?: FindOneOptions): Promise<TradeEntity> {
    let trade: TradeEntity | undefined;
    try {
      trade = await this.repository.findOne(query, options);
    } catch (e) {
      // throw new DBErrorException(e);
      throw { statusCode: 500, message: e }
    }
    if (!trade) {
      throw { statusCode: 404, message: `Trade ${JSON.stringify(query)} not found` }
    }
    return trade;
  }

  // Get all the Trades in the DB
  public async getManyTrades(): Promise<TradeEntity[]> {
    // TODO - Sort in ASC order with ID
    return this.repository.find();
  }

  // Create one Trade
  public async createOneTrade(
    body: CreateTradeDTO,
    // reply: FastifyReply
  ): Promise<TradeEntity> {
    // await this.getOneTrade({ symbol: body.symbol });
    // Using this to verify if the Stock exists
    await this.stocksService.getOneStock({ symbol: body.symbol });

    if (body.timestamp) {
      const parsed = parse(body.timestamp, 'yyyy-MM-dd HH:mm:ss', new Date()).toDateString();
      if (parsed == 'Invalid Date') {
        // reply.status(400)
        // throw Error(`Invalid DateTime string (${body.timestamp}). Please format your string the way 'yyyy-MM-dd HH:mm:SS'`)
        throw { statusCode: 400, message: `Invalid DateTime string (${body.timestamp}). Please format your string the way 'yyyy-MM-dd HH:mm:SS'` }
      }
    }
    
    return this.repository.save(
      this.repository.merge(new TradeEntity(), body as any)
    );
  }
  
  // Get all the Trades in the DB with Trade.user.id
  public async getManyTradesByUserId(userId: string): Promise<TradeEntity[]> {
    // TODO - Sort in ASC order with ID

    return this.repository
      .createQueryBuilder('trade')
      .select()
      .where(`"user" ->> 'id' = '${userId}'`)
      .getMany();
  }

  // public async getPeriodHighLowTradePrices(
  //   symbol: string,
  //   start?: string,
  //   end?: string
  // ): Promise<{symbol?: string, highest?: string, lowest?: string, message?: string}> {
  //   start = start ? parse(start, 'yyyy-MM-dd HH:mm:SS', new Date()).toDateString() : undefined;
  //   end = end ? parse(end, 'yyyy-MM-dd HH:mm:SS', new Date()).toDateString() : undefined;
  //   const prices = (
  //     await this.repository.query(`SELECT price
  //       FROM trades 
  //       WHERE
  //         symbol = $1 AND timestamp >= $2 AND timestamp <= $3
  //     `, [symbol, start, end])
  //   ).map((obj: {price: number}) => obj.price)
  //   .sort((a: number, b: number) => a - b);
  //   console.log({symbol, start, end, prices})
  //   if (prices.length > 0) {
  //     const [lowest, highest] = [prices[0], prices[prices.length - 1]];
  //     return { symbol, highest, lowest }
      
  //   } else {
  //     return {
  //       message: "There are no trades in the given date range"
  //     }
  //   }
  // }
  
  public async deleteAllTrades(): Promise<void> {
    return this.repository.query(`TRUNCATE TABLE trades`)
  }
}