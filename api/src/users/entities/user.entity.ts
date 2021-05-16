import { InstanceEntity } from "../../common/entities/instance.entity";
import { Entity, Column } from "typeorm";

@Entity('users')
export class UserEntity extends InstanceEntity {
  @Column({ type: 'text', nullable: false })
  public name: string;
}
