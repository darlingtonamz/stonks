import { Repository } from 'typeorm';
import { Initializer, Service } from 'fastify-decorators';
import { StockEntity } from '../entities/stock.entity';
import { ConnectionService } from '../../db/providers/connection.service';
import { parse } from 'date-fns';
import { CreateStockDTO } from '../dtos/stock.dto';

@Service()
export class StocksService {
  private repository!: Repository<StockEntity>;
  constructor(private connectionService: ConnectionService) {}

  @Initializer([ConnectionService])
  async init(): Promise<void> {
    this.repository = this.connectionService.connection.getRepository(StockEntity);
  }

  // Create one Stock
  public async createOneStock(body: CreateStockDTO): Promise<StockEntity> {
    return this.repository.save(
      this.repository.merge(new StockEntity(), body)
    );
  }

  public async getPeriodHighLowStockPrices(
    symbol: string,
    start?: string,
    end?: string
  ): Promise<{symbol?: string, highest?: string, lowest?: string, message?: string}> {
    start = start ? parse(start, 'yyyy-MM-dd HH:mm:SS', new Date()).toDateString() : undefined;
    end = end ? parse(end, 'yyyy-MM-dd HH:mm:SS', new Date()).toDateString() : undefined;
    const prices = (
      await this.repository.query(`SELECT price
        FROM trades 
        WHERE
          symbol = $1 AND timestamp >= $2 AND timestamp <= $3
      `, [symbol, start, end])
    ).map((obj: {price: number}) => obj.price)
    .sort((a: number, b: number) => a - b);
    console.log({symbol, start, end, prices})
    if (prices.length > 0) {
      const [lowest, highest] = [prices[0], prices[prices.length - 1]];
      return { symbol, highest, lowest }
      
    } else {
      return {
        message: "There are no trades in the given date range"
      }
    }
  }
}