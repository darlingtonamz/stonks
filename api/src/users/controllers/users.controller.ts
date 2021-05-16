import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';
import { CreateUserDTO, CreateUserSchema } from '../dtos/user.dto';
import { UsersService } from '../providers/users.service';

const UserGetOneParamSchema: any = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    },
  },
  required: ['id'],
};

@Controller({ route: '/users' })
export class UsersController {
  constructor(public service: UsersService) {}
  
  @GET('/')
  async getMany(
    _: FastifyRequest,
    reply: FastifyReply
  ) {
    reply.status(200)
    return this.service.getManyUsers();
  }

  @GET('/:id', {
    schema: {
      params: UserGetOneParamSchema,
    },
  })
  async getOne(
    { params }: FastifyRequest,
    reply: FastifyReply
  ) {
    reply.status(200)
    return this.service.getOneUser({ id: (params as any)['id'] });
  }

  @POST('/', {
    schema: {
      body: CreateUserSchema,
    },
  })
  async createOne(
    { body }: { body: CreateUserDTO },
    reply: FastifyReply
  ) {
    reply.status(201)
    return this.service.createOneUser(body);
  }
}

export default UsersController;