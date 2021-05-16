import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { Initializer, Service } from 'fastify-decorators';
import { UserEntity } from '../entities/user.entity';
import { ConnectionService } from '../../db/providers/connection.service';
import { CreateUserDTO } from '../dtos/user.dto';

@Service()
export class UsersService {
  private repository!: Repository<UserEntity>;
  constructor(private connectionService: ConnectionService) {}

  @Initializer([ConnectionService])
  async init(): Promise<void> {
    this.repository = this.connectionService.connection.getRepository(UserEntity);
  }
  
  public async getOneUser(query: FindConditions<UserEntity>, options?: FindOneOptions): Promise<UserEntity> {
    let user: UserEntity | undefined;
    try {
      user = await this.repository.findOne(query, options);
    } catch (e) {
      throw { statusCode: 500, message: e }
    }
    if (!user) {
      throw { statusCode: 404, message: `User ${JSON.stringify(query)} not found` }
    }
    return user;
  }

  // Create one User
  public async createOneUser(
    body: CreateUserDTO,
  ): Promise<UserEntity> {
    return this.repository.save(
      this.repository.merge(new UserEntity(), body)
    );
  }

  public async getManyUsers() {
    return this.repository.find();
  }
}