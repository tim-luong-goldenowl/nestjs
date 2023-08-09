import {  Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import FileStorage from './file-storage.entity';

@Module({
  controllers: [],
  providers: [FileStorageService],
  imports: [TypeOrmModule.forFeature([FileStorage])],
  exports: [FileStorageService]
})
export class FileStorageModule {}