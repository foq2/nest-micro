import { defineEntity, p } from '@mikro-orm/core';

export const BaseSchema = defineEntity({
  name: 'BaseEntity',
  abstract: true,
  filters: {
    softDelete: {
      name: 'softDelete',
      cond: { deletedAt: null },
      default: true,
    },
  },
  properties: {
    id: p.uuid().primary(),
    createdAt: p
      .datetime()
      .onCreate(() => new Date())
      .defaultRaw('now()'),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date())
      .defaultRaw('now()'),
    deletedAt: p.datetime().nullable().hidden(),
  },
});

export abstract class BaseEntity<T = any> extends BaseSchema.class {
  // [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt' | 'deletedAt';
  // [HiddenProps]?: 'deletedAt';
  // constructor(partial?: Partial<T>) {
  //   super();
  //   if (partial) {
  //     Object.assign(this, partial);
  //   }
  // }
}

BaseSchema.setClass(BaseEntity);
