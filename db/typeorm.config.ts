
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config'

export const appDatasourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js']
}

const appDatasource = new DataSource(appDatasourceOptions);

export default appDatasource;