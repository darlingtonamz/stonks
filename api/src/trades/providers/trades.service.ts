import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { CreateTradeDTO } from '../dtos/trade.dto';
import { TradeEntity } from '../entities/trade.entity';
import { ConnectionService } from '../../db/providers/connection.service';
import { parse } from 'date-fns';
import { StocksService } from '../../stocks/providers/stocks.service';
import { UsersService } from '../../users/providers/users.service';

@Service()
export class TradesService {
  private repository!: Repository<TradeEntity>;
  
  @Inject(StocksService)
  private stocksService!: StocksService;

  @Inject(UsersService)
  private usersService!: UsersService;

  constructor(private connectionService: ConnectionService) {}

  @Initializer([ConnectionService])
  async init(): Promise<void> {
    this.repository = this.connectionService.connection.getRepository(TradeEntity);
  }

  public async getOneTrade(query: FindConditions<TradeEntity>, options?: FindOneOptions): Promise<TradeEntity> {
    let trade: TradeEntity | undefined;
    try {
      trade = await this.repository.findOne(query, options);
    } catch (e) {
      throw { statusCode: 500, message: e }
    }
    if (!trade) {
      throw { statusCode: 404, message: `Trade ${JSON.stringify(query)} not found` }
    }
    return trade;
  }

  // Get all the Trades in the DB
  public async getManyTrades(): Promise<TradeEntity[]> {
    // TODO - Sort in ASC order with Trade ID
    return this.repository.find();
  }

  // Create one Trade
  public async createOneTrade(
    body: CreateTradeDTO,
  ): Promise<TradeEntity> {
    // Using this to verify if the Stock exists
    await this.stocksService.getOneStock({ symbol: body.symbol });

    if (body.timestamp) {
      const parsed = parse(body.timestamp, 'yyyy-MM-dd HH:mm:ss', new Date()).toDateString();
      if (parsed == 'Invalid Date') {
        throw { statusCode: 400, message: `Invalid DateTime string (${body.timestamp}). Please format your string the way 'yyyy-MM-dd HH:mm:SS'` }
      }
    }

    // verify that the user with id exists
    await this.usersService.getOneUser({ id: body.user.id });

    return this.repository.save(
      this.repository.merge(new TradeEntity(), body as any)
    );
  }
  
  // Get all the Trades in the DB with Trade.user.id
  public async getManyTradesByUserId(userId: string): Promise<TradeEntity[]> {
    // TODO - Sort in ASC order with Trade ID
    return this.repository
      .createQueryBuilder('trade')
      .select()
      .where(`"user" ->> 'id' = '${userId}'`)
      .getMany();
  }

  public async deleteAllTrades(): Promise<void> {
    return this.repository.query(`TRUNCATE TABLE trades`)
  }
}