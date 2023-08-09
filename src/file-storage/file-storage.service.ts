import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FileStorage from './file-storage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileStorageService {
    constructor(
        @InjectRepository(FileStorage)
        private fileStorageRepository: Repository<FileStorage>,
    ) { }

    async create(params) {
      const fileRecord = await this.fileStorageRepository.create(params)
      this.fileStorageRepository.save(fileRecord);
      return fileRecord
    }
}
