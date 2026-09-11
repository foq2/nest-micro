import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '@repo/nest-core';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {
  @Property({ type: 'string' })
  name: string;

  @Property({ type: 'string' })
  email: string;

  @Property({ type: 'string' })
  username: string;

  @Property({ type: 'string' })
  password: string;
}
