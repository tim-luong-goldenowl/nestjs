
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
// import User from 'src/users/entities/user.entity';
// import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { CreateUsers1690212553734 } from 'src/migration/1690212553734-create-users';
import 'dotenv/config'
const configService = new ConfigService();
console.log("!!!!!!!!!!!", configService.get('DB_NAME'))
export const AppDatasource = new DataSource({
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
});