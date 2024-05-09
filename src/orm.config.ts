import { join } from 'path';

export const entityMigration = {
  entities: [join(__dirname, './module/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migration/*{.ts,.js}')],
};
