
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import User from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { CreateUsers1690212553734 } from 'src/migration/1690212553734-create-users';
import 'dotenv/config'
 
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          DonationReceiver, User
        ],
        migrations: ["./src/migration/*.ts"],
        migrationsTableName: "migrations",
        synchronize: false,
      }),
      dataSourceFactory: async () => {
        const dataSource = await new DataSource(
          {
            type: 'postgres',
            // host: configService.get('DB_HOST'),
            // port: configService.get('DB_PORT'),
            // username: configService.get('DB_USER'),
            // password: configService.get('DB_PASSWORD'),
            // database: configService.get('DB_NAME'),
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [
                
            ],
            migrations: [
                CreateUsers1690212553734
            ]
          }
        ).initialize();
        return dataSource;
      },
    }),
  ],
})
export class DatabaseModule {}