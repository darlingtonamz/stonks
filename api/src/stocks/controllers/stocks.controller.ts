import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';
import { CreateStockDTO, CreateStockSchema } from '../dtos/stock.dto';
import { StocksService } from '../providers/stocks.service';

@Controller({ route: '/stocks' })
export class StocksController {
  constructor(public service: StocksService) {}

  @POST('/', {
    schema: {
      body: CreateStockSchema,
    },
  })
  async createOne(
    { body }: { body: CreateStockDTO },
    reply: FastifyReply
  ) {
    reply.status(201)
    return this.service.createOneStock(body);
  }

  // GET /stocks/AC/price?start=2014-06-14&end=2014-06-14
  @GET('/:stock_symbol/price')
  async getPeriodHighLowTradePrices(
    { params, query }: { params: any, query: any }
  ) {
    const { start, end } = query;
    return this.service.getPeriodHighLowStockPrices(params.stock_symbol, start, end);
  }

  @GET('/stats')
  async getStats(
    { query }: FastifyRequest,
  ) {
    const { start, end } = query as any;
    return this.service.getStockStats(start, end);
  }
}

export default StocksController;