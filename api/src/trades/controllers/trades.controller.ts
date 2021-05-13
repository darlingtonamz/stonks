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
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  FastifyRequest
  // FastifyReply,
} from 'fastify';
import { Controller, GET } from 'fastify-decorators';
import { CreateTradeDTO } from '../dtos/trade.dto';
import { TradesService } from '../providers/trades.service';

@Controller({ route: '/trades' })
export class TradesController {
  constructor(public service: TradesService) {}

  @GET('/', {
    // schema: {},
    validatorCompiler: () => async (data) => {
      const object = plainToClass(CreateTradeDTO, data);
      const errors = await validate(object);
      // if (errors.length > 0) {
      //   throw new BadRequestException(errors);
      // }
      return errors.length > 0 ? {error: errors} : { value: data };
    } 
  })
  async helloHandler(
    request: FastifyRequest,
    // reply: FastifyReply
  ) {
    return this.service.hello(request.body);
  }

  @GET({ url: '/goodbye' })
  async goodbyeHandler() {
    return 'Bye-bye!!!';
  }
}

export default TradesController;