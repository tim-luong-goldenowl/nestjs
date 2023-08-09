import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './controllers/users/user.controller';
import { UsersMiddleware } from './middlewares/users/users.middleware';
import { UsersService } from './services/users/users.service';
import User from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { MulterModule } from '@nestjs/platform-express';
import { S3Module } from 'src/s3/s3.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User, DonationReceiver]), NestjsFormDataModule, S3Module]
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      UsersMiddleware
    ).forRoutes('users')
  }
}