import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './controllers/users/user.controller';
import { UsersMiddleware } from './middlewares/users/users.middleware';
import { UsersService } from './services/users/users.service';
import User from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { MulterModule } from '@nestjs/platform-express';
import { FileStorageService } from 'src/file-storage/file-storage.service';
import FileStorage from 'src/file-storage/file-storage.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService, FileStorageService],
  imports: [TypeOrmModule.forFeature([User, DonationReceiver, FileStorage]), NestjsFormDataModule,
  MulterModule.register({
    dest: './files'
  })]
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      UsersMiddleware
    ).forRoutes('users')
  }
}