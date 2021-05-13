import "reflect-metadata";
import Fastify, {
  FastifyInstance,
  // FastifyServerOptions,
  RouteShorthandOptions,
  // FastifyRequest,
} from 'fastify';
import config from './config/configuration';
import { TradesModule } from "./trades/trades.module";
import { bootstrap } from 'fastify-decorators';
// import { resolve } from 'path';
import { Constructor } from "fastify-decorators/decorators/helpers/inject-dependencies";
import { IAppModule } from "./common/interfaces/interfaces";

const { port: PORT } = config();

// const test: FastifyServerOptions;
const server: FastifyInstance = Fastify({ logger: true });

const modules: IAppModule[] = [
  TradesModule,
]
let controllers: Constructor<unknown>[] = [];
for (const module of modules) {
  controllers = controllers.concat(module.controllers)
}
server.register(bootstrap, {
  controllers
});

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string'
          }
        }
      }
    }
  }
}

server.get('/health', opts, async (
  // request: FastifyRequest,
  // reply: FastifyRequest,
) => {
  return { pong: 'it worked!' }
})

server.get('/ping', opts, async (
  // request: FastifyRequest,
  // reply: FastifyRequest,
) => {
  return { pong: 'it worked!' }
})

const start = async () => {
  try {
    await server.listen(PORT, '0.0.0.0')

    // const address = server.server.address()
    // const port = typeof address === 'string' ? address : address?.port
    console.log(`API running at port ${PORT}`)

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()