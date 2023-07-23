import { Module } from '@nestjs/common';
import { DonationReceiversController } from './controllers/donation-receivers/donation-receivers.controller';
import { StripeConnectService } from 'src/stripe/services/stripe-connect/stripe-connect.service';
import { DonationReceiversService } from './services/donation-receivers/donation-receivers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import DonationReceiver from './entities/donation-receiver.entity';

@Module({
  controllers: [DonationReceiversController],
  providers: [StripeConnectService, DonationReceiversService],
  imports: [TypeOrmModule.forFeature([DonationReceiver])]
})
export class DonationReceiversModule {}
