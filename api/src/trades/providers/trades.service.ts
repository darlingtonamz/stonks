import { Service } from 'fastify-decorators';
// import { FastifyReply, FastifyRequest } from 'fastify';

@Service()
export class TradesService {
  hello(body: any) {
    return `Hello world! ${body}`;
  }
}