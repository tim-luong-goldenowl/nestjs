import { Module } from '@nestjs/common';
import { StripeConnectCustomersService } from './stripe-connect-customers.service';
import StripeConnectCustomer from './stripe-connect-customers.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [StripeConnectCustomersService],
  imports: [TypeOrmModule.forFeature([StripeConnectCustomer])],
  exports: [StripeConnectCustomersService]
})
export class StripeConnectCustomersModule {}
