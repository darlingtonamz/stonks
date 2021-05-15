import "reflect-metadata";
// import Fastify, {
//   FastifyInstance,
//   RouteShorthandOptions,
// } from 'fastify';
import config from './config/configuration';
// import { TradesModule } from "./trades/trades.module";
// import { bootstrap } from 'fastify-decorators';
// import { Constructor } from "fastify-decorators/decorators/helpers/inject-dependencies";
// import { IAppModule } from "./common/interfaces/interfaces";
// import { StocksModule } from "./stocks/stocks.module";

// const Ajv = require('ajv').default;
// const AjvErrors = require('ajv-errors')


const { port: PORT } = config();

// // const test: FastifyServerOptions;
// const server: FastifyInstance = Fastify({ logger: true });


// // console.log({Ajv, AjvErrors})
// const ajv = new Ajv({
//   allErrors: true,
//   removeAdditional: true,
//   useDefaults: true,
//   coerceTypes: true,
//   // nullable: true, 
// })
// // enhance the ajv instance
// AjvErrors(ajv)

// server.setValidatorCompiler(({ schema }) => {
  
//   // return () => ({});
//   const validation = ajv.compile(schema);
//   // console.log('Validator 212 ############', {schema, validation})
//   return validation;
// })
// // server.setErrorHandler(function (error, _, reply) {
// //   console.log('Validator X1 ############', error)
// //   if (error.validation) {
// //     console.log('Validator X2 ############', error)
// //      reply.status(422).send(new Error('validation failed'))
// //   }
// // })


// export const appModules: IAppModule[] = [
//   TradesModule,
//   StocksModule,
// ]
// let controllers: Constructor<unknown>[] = [];
// for (const module of appModules) {
//   controllers = controllers.concat(module.controllers)
// }
// server.register(bootstrap, {
//   controllers
// });

// const opts: RouteShorthandOptions = {
//   schema: {
//     response: {
//       200: {
//         type: 'object',
//         properties: {
//           pong: {
//             type: 'string'
//           }
//         }
//       }
//     }
//   }
// }

// server.get('/health', opts, async () => {
//   return { pong: 'it worked!' }
// });

// const start = async () => {
//   try {
//     await server.listen(PORT, '0.0.0.0');
//     console.log(`API running at port ${PORT}`);

//   } catch (err) {
//     server.log.error(err);
//     process.exit(1);
//   }
// }
// start();

// 'use strict'
import appBuild from './app';
const server = appBuild({
  logger: true,
  // logger: {
  //   level: 'info',
  //   prettyPrint: true
  // }
})

server.listen(PORT, '0.0.0.0', (err: any) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
});
