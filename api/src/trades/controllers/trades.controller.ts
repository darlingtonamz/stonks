// import { FastifyInstance, FastifyLoggerInstance } from "fastify"
// import {
//   ServerResponse
// } from "http"
// import { IncomingMessage } from "http"
// import { Server } from "http"

// export const TradesController = (
//   fastify: FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>,
//   opt: any,
//   done: Function
// ) => {
//   fastify.get('/trades', (_, reply) => {
//     reply.send({ hello: 'Trades', opt });
//   });
//   done();
// }
// import { plainToClass } from 'class-transformer';
// import { validate } from 'class-validator';
import { FastifyReply } from 'fastify';
// import {
//   FastifyRequest
//   // FastifyReply,
// } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';
import { CreateTradeDTO, CreateTradeSchema } from '../dtos/trade.dto';
import { TradesService } from '../providers/trades.service';

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
    reply.status(201).send(await this.service.createOneTrade(body));
  }

  @GET({ url: '/goodbye' })
  async goodbyeHandler() {
    return 'Bye-bye!!!';
  }

  @GET('/users/:user_id')
  async getManyByUserId(
    {params}: {params: any}
  ) {
    // TODO - MAke User entity
    return this.service.getManyTradesByUserId(params.user_id);
  }
}

export default TradesController;