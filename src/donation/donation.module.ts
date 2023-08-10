import { Module } from '@nestjs/common';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Donation from './donation.entity';
import { StripeModule } from 'nestjs-stripe';
import { PaymentIntentService } from 'src/stripe/services/payments/payment-intent.service';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';

@Module({
  controllers: [DonationController],
  providers: [DonationService, PaymentIntentService],
  imports: [TypeOrmModule.forFeature([Donation, DonationReceiver]), StripeModule]

})
export class DonationModule {}
