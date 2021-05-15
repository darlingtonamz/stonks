import "reflect-metadata";
import Fastify, {
  FastifyInstance,
} from 'fastify';
import { TradesModule } from "./trades/trades.module";
import { bootstrap } from 'fastify-decorators';
import { Constructor } from "fastify-decorators/decorators/helpers/inject-dependencies";
import { IAppModule } from "./common/interfaces/interfaces";
import { StocksModule } from "./stocks/stocks.module";

const Ajv = require('ajv').default;
const AjvErrors = require('ajv-errors');

export const appModules: IAppModule[] = [
  TradesModule,
  StocksModule,
];

function build(appOptions={}) {
  const server: FastifyInstance = Fastify(appOptions);

  const ajv = new Ajv({
    allErrors: true,
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    // nullable: true, 
  })
  // enhance the ajv instance
  AjvErrors(ajv)
  
  server.setValidatorCompiler(({ schema }) => {
    const validation = ajv.compile(schema);
    return validation;
  });

  // server.setErrorHandler(function (error, _, reply) {
  //   console.log('Validator X1 ############', error)
  //   if (error.validation) {
  //     console.log('Validator X2 ############', error)
  //      reply.status(422).send(new Error('validation failed'))
  //   }
  // })
  
  
  let controllers: Constructor<unknown>[] = [];
  for (const module of appModules) {
    controllers = controllers.concat(module.controllers)
  }
  server.register(bootstrap, {
    controllers
  });

  server.get('/health', {}, async () => {
    return { pong: 'it worked!' }
  });

  return server;
}

export default build;
