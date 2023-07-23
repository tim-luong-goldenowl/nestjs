import { Module } from '@nestjs/common';
import { StripeConnectService } from './services/stripe-connect/stripe-connect.service';
import { StripeModule } from 'nestjs-stripe';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [StripeConnectService],
  imports: [
    StripeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get('STRIPE_TEST_SECRET_KEY'),
        apiVersion: '2022-11-15'
      })
    })
  ]
})
export class StripeUltilsModule {}
