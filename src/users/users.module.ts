import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './controllers/users/user.controller';
import { UsersMiddleware } from './middlewares/users/users.middleware';
import { UsersService } from './services/users.service';
import User from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { S3Module } from 'src/s3/s3.module';
import { ConfigService } from '@nestjs/config';
import { STRIPE_MICROSERVICE_NAME } from 'src/constants';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { UserStripeCustomerService } from './services/user-stripe-customer.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ConfigService, UserStripeCustomerService,
    {
      provide: STRIPE_MICROSERVICE_NAME,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('STRIPE_MICROSERVICE_HOST'),
            port: configService.get('STRIPE_MICROSERVICE_PORT'),
          },
        }),
    },],
  imports: [TypeOrmModule.forFeature([User, DonationReceiver]), NestjsFormDataModule, S3Module]
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      UsersMiddleware
    ).forRoutes('users')
  }
}