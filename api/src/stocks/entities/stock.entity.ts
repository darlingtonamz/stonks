import { InstanceEntity } from "../../common/entities/instance.entity";
import { Entity, Column } from "typeorm";

@Entity('stocks')
export class StockEntity extends InstanceEntity {
  // TODO - make symbol indexed and unique
  @Column({ type: 'text', nullable: false })
  public symbol: string;
}
