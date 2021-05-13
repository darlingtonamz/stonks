import { FastifyReply } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';
import { CreateTradeDTO, CreateTradeSchema } from '../dtos/trade.dto';
import { TradesService } from '../providers/trades.service';
import { format } from 'date-fns';

function tradeSerializer(data: any) {
  let output;
  if (Array.isArray(data)) {
    output = data.map((trade) => {
      trade.timestamp = format(trade.timestamp, 'yyyy-MM-dd HH:mm:SS');
    })
  } else {
    output = {
      ...data,
      timestamp: format(data.timestamp, 'yyyy-MM-dd HH:mm:SS')
    };
  }
  return JSON.stringify(output);
};

@Controller({ route: '/trades' })
export class TradesController {
  constructor(public service: TradesService) {}

  @GET('/')
  async getMany() {
    return this.service.getManyTrades();
  }

  @POST('/', {
    schema: {
      body: CreateTradeSchema,
    },
    // errorHandler: (error, _, reply) => {
    //   console.log('Validator X1 ############', error)
    //   if (error.validation) {
    //     console.log('Validator X2 ############', error)
    //      reply.status(422).send(new Error('validation failed'))
    //   }
    // }
  })
  async createOne(
    { body }: { body: CreateTradeDTO },
    reply: FastifyReply
  ) {
    reply
      .status(201)
      .header('Content-Type', 'application/json')
      .serializer(tradeSerializer)
    return this.service.createOneTrade(body, reply);
  }

  // @GET({ url: '/goodbye' })
  // async goodbyeHandler() {
  //   return 'Bye-bye!!!';
  // }

  @GET('/users/:user_id')
  async getManyByUserId(
    {params}: {params: any}
  ) {
    // TODO - MAke User entity
    return this.service.getManyTradesByUserId(params.user_id);
  }
}

export default TradesController;