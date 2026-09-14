import { Migration } from '@mikro-orm/migrations';

export class Migration20260914082606_create_table_users extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "users"
       (
         "id"         uuid         not null,
         "created_at" timestamptz  not null,
         "updated_at" timestamptz  not null,
         "deleted_at" timestamptz null,
         "name"       varchar(255) not null,
         "email"      varchar(255) not null,
         "username"   varchar(255) not null,
         "password"   varchar(255) not null,
         primary key ("id")
       );`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }
}
