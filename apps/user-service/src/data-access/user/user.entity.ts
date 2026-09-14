import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '@repo/nest-core';
import { UserRepository } from './user.repository';
import { EntityRepositoryType, Hidden } from '@mikro-orm/core';

@Entity({ tableName: 'users', repository: () => UserRepository })
export class UserEntity extends BaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property({ type: 'string' })
  name: string;

  @Property({ type: 'string' })
  email: string;

  @Property({ type: 'string' })
  username: string;

  @Property({ type: 'string', hidden: true })
  password: Hidden<string>;
}
