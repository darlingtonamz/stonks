import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';
import { CreateTradeDTO, CreateTradeSchema } from '../dtos/trade.dto';
import { TradesService } from '../providers/trades.service';
import { format } from 'date-fns';

function tradeSerializer(data: any) {
  let output;

  if (Array.isArray(data)) {
    output = data.map((trade) => {
      if (trade.timestamp)
        trade.timestamp = format(trade.timestamp, 'yyyy-MM-dd HH:mm:ss');
      return trade;
    });
  } else {
    if (data.timestamp)
      data.timestamp = format(data.timestamp, 'yyyy-MM-dd HH:mm:ss');
    output = data;
  }
  return JSON.stringify(output);
};

@Controller({ route: '/trades' })
export class TradesController {
  constructor(public service: TradesService) {}

  @GET('/')
  async getMany(
    _: FastifyRequest,
    reply: FastifyReply
  ) {
    reply
      .header('Content-Type', 'application/json')
      .serializer(tradeSerializer)
    return this.service.getManyTrades();
  }

  @GET('/:id')
  async getOne(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const params: any = request.params;
    reply
      .header('Content-Type', 'application/json')
      .serializer(tradeSerializer)
    return this.service.getOneTrade({ id: params['id'] });
  }

  @POST('/', {
    schema: {
      body: CreateTradeSchema,
    },
  })
  async createOne(
    { body }: { body: CreateTradeDTO },
    reply: FastifyReply
  ) {
    reply
      .status(201)
      .header('Content-Type', 'application/json')
      .serializer(tradeSerializer);
    return this.service.createOneTrade(body);
  }

  @GET('/users/:user_id')
  async getManyByUserId(
    {params}: {params: any},
    reply: FastifyReply
  ) {
    reply
      .status(201)
      .header('Content-Type', 'application/json')
      .serializer(tradeSerializer);
    return this.service.getManyTradesByUserId(params.user_id);
  }
}

export default TradesController;