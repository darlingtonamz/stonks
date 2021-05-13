import { FastifyReply } from 'fastify';
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
    reply.status(201).send(await this.service.createOneStock(body));
  }

  // api.amanze.local/stocks/AC/price?start=2014-06-14 13:13:13&end=2014-06-14 13:13:13
  @GET('/:stock_symbol/price')
  async getPeriodHighLowTradePrices(
    {params, query}: {params: any, query: any}
  ) {
    const { start, end } = query;
    return this.service.getPeriodHighLowStockPrices(params.stock_symbol, start, end);
  }
}

export default StocksController;