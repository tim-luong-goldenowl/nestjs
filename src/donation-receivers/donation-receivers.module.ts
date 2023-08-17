import { Module } from '@nestjs/common';
import { DonationReceiversController } from './controllers/donation-receivers/donation-receivers.controller';
import { StripeConnectService } from 'src/stripe/services/stripe-connect/stripe-connect.service';
import { DonationReceiversService } from './services/donation-receivers/donation-receivers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import DonationReceiver from './entities/donation-receiver.entity';
import { DonationService } from 'src/donation/donation.service';
import Donation from 'src/donation/donation.entity';
import { PaymentIntentService } from 'src/stripe/services/payments/payment-intent.service';
import { StripeCustomerService } from 'src/stripe/services/customers/customer.service';
import User from 'src/users/entities/user.entity';
import { S3Service } from 'src/s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [DonationReceiversController],
  providers: [StripeConnectService, DonationReceiversService, DonationService, S3Service, ConfigService, MailService],
  imports: [TypeOrmModule.forFeature([DonationReceiver, Donation, User])]
})
export class DonationReceiversModule {}
