import { InstanceEntity } from "../../common/entities/instance.entity";
import { Entity, Column, CreateDateColumn } from "typeorm";

interface ITradeUser {
  id: string;
  name: string;
}

@Entity('trades')
export class TradeEntity extends InstanceEntity {
  @Column()
  public type: string;

  @Column({ type: 'jsonb', nullable: true })
  public user: ITradeUser;

  @Column({ type: 'text', nullable: false })
  public symbol: string;

  @Column({ type: 'integer', nullable: false })
  public shares: number;

  @Column({ type: 'float', nullable: false })
  public price: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  public timestamp: Date;
}