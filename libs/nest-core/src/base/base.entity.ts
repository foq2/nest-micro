import {
  Entity,
  Filter,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { v4 as uuid } from 'uuid';

@Filter({
  name: 'softDelete',
  cond: { deletedAt: null },
  default: true,
})
@Entity({ abstract: true })
export abstract class BaseEntity<T = any> {
  constructor(partial?: Partial<T>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Property({ type: 'timestamptz', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'timestamptz', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: 'timestamptz', nullable: true, hidden: true })
  deletedAt?: Date;
}
