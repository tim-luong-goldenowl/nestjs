import { Module } from '@nestjs/common';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Donation from './donation.entity';
import { StripeModule } from 'nestjs-stripe';
import { PaymentIntentService } from 'src/stripe/services/payments/payment-intent.service';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import User from 'src/users/entities/user.entity';
import { StripeCustomerService } from 'src/stripe/services/customers/customer.service';
import { CreateDonationService } from './create-donation.service';

@Module({
  controllers: [DonationController],
  providers: [DonationService, PaymentIntentService, StripeCustomerService, CreateDonationService],
  imports: [TypeOrmModule.forFeature([Donation, DonationReceiver, User]), StripeModule]
})
export class DonationModule {}
