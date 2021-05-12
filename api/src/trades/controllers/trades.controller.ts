import { FastifyInstance, FastifyLoggerInstance } from "fastify"
import {
  ServerResponse
} from "http"
import { IncomingMessage } from "http"
import { Server } from "http"

export const TradesController = (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>,
  opt: any,
  done: Function
) => {
  fastify.get('/trades', (_, reply) => {
    reply.send({ hello: 'Trades', opt });
  });
  done();
}

export default TradesController;