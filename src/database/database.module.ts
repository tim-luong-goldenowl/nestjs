
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appDatasourceOptions } from 'db/typeorm.config';
 
@Module({
  imports: [
    TypeOrmModule.forRoot(appDatasourceOptions)
  ],
})
export class DatabaseModule {}