import { Module } from '@nestjs/common';
import { StripeConnectService } from './services/stripe-connect/stripe-connect.service';
import { StripeModule } from 'nestjs-stripe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentIntentService } from './services/payments/payment-intent.service';
import { StripeCustomerService } from './services/customers/customer.service';
import { StripeController } from './stripe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/users/entities/user.entity';
import { STRIPE_MICROSERVICE_NAME } from 'src/constants';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  providers: [StripeConnectService, PaymentIntentService, StripeCustomerService, ConfigService,
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
    },
  ],
  controllers: [StripeController],
  imports: [
    TypeOrmModule.forFeature([User]),
    StripeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get('STRIPE_TEST_SECRET_KEY'),
        apiVersion: '2022-11-15'
      })
    })
  ],
   exports: [PaymentIntentService, StripeCustomerService]
})
export class StripeUltilsModule {}
