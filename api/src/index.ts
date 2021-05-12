import "reflect-metadata";
import Fastify, {
  FastifyInstance,
  RouteShorthandOptions,
  // FastifyRequest,
} from 'fastify';
import config from './config/configuration';
import { TradesModule } from "./trades/trades.module";
// import { PORT } from './config/constants';
const PORT = config().port;

const modules = [
  TradesModule
]

const server: FastifyInstance = Fastify({ logger: true })
for (const module of modules) {
  module.controllers.forEach((controller) => {
    server.register(controller)
  });
}
// fastify.register(require('./routes/v1/users'), { prefix: '/v1' })

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
    await server.listen(PORT)

    // const address = server.server.address()
    // const port = typeof address === 'string' ? address : address?.port
    console.log(`API running at port ${PORT}`)

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()