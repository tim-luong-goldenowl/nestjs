import { Injectable } from '@nestjs/common';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import User from 'src/users/entities/user.entity';
import StripeConnectCustomer from './stripe-connect-customers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StripeConnectCustomersService {
    constructor(
        @InjectRepository(StripeConnectCustomer)
        private stripeConnectCustomerRepository: Repository<StripeConnectCustomer>,
    ) { }
    async findByUserAndDonationReceiver(user: User, donationReceiver: DonationReceiver) {
        return await this.stripeConnectCustomerRepository.findOne({
            where: {
                user,
                donationReceiver
            }
        })
    }

    async create(user: User, donationReceiver: DonationReceiver) {
         const donation = await this.stripeConnectCustomerRepository.create({ ...params, user: donateUser, donationReceiver })

    }
}
