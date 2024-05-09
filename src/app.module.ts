import { Module, OnModuleDestroy } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DEFAULT_SCHEMA, ENV } from './common/constant';
import { ConfigModule } from './module/common/config/config.module';
import { ConfigService } from './module/common/config/config.service';
import { RootModule } from './module/root.module';
import { entityMigration } from './orm.config';
import { SnakeNamingStrategy } from './snake-naming.strategy';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
      serveStaticOptions: {
        index: false,
      },
    }),
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get().db.host,
          port: configService.get().db.port,
          username: configService.get().db.username,
          password: configService.get().db.password,
          database: configService.get().db.db_name,
          namingStrategy: new SnakeNamingStrategy(),
          logging: true,
          ssl: configService.get().env === ENV.prod && true,
          ...entityMigration,
        };
      },
      dataSourceFactory: async (options: PostgresConnectionOptions) => {
        let dataSource = await new DataSource(options).initialize();

        const schemas: any[] = await dataSource.query(
          `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${DEFAULT_SCHEMA}';`,
        );
        console.log(`${new Date().toString()} 🚀 ~ file: app.module.ts:49 ~ dataSourceFactory: ~ schemas:`, schemas);

        if (schemas.length === 0) {
          await dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${DEFAULT_SCHEMA}"`);
        }

        await dataSource.destroy();

        const newOptions: PostgresConnectionOptions = {
          ...options,
          schema: DEFAULT_SCHEMA,
          name: DEFAULT_SCHEMA,
        };

        dataSource = await new DataSource(newOptions).initialize();
        await dataSource.runMigrations();

        return dataSource;
      },
    }),
    RootModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleDestroy {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleDestroy() {
    try {
      await this.dataSource.destroy();
    } catch (error) {
      console.log(`${new Date().toString()} 🚀 ~ file: app.module.ts:84 ~ AppModule ~ onModuleDestroy ~ error:`, error);
    }
  }
}
