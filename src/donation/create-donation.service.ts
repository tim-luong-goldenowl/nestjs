import { BadRequestException, Injectable } from '@nestjs/common';
import { DonationDto } from './donation.dto';
import Donation from './donation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import User from 'src/users/entities/user.entity';
import { PaymentIntentService } from 'src/stripe/services/payments/payment-intent.service';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { StripeCustomerService } from 'src/stripe/services/customers/customer.service';
import { StripeConnectCustomersService } from 'src/stripe-connect-customers/stripe-connect-customers.service';

@Injectable()
export class CreateDonationService {
    constructor(
        @InjectRepository(Donation)
        private donationRepository: Repository<Donation>,
        private paymentIntentService: PaymentIntentService,
        private stripeCustomerService: StripeCustomerService,
        private stripeConnectCustomersService: StripeConnectCustomersService,
        @InjectRepository(DonationReceiver) private donationReceiverRepository: Repository<DonationReceiver>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    async create(params: DonationDto, donateUser: User): Promise<any> {
        try {
            let stripeCustomerId = donateUser.stripeCustomerId

            if (!stripeCustomerId) {
                const newCustomerId = await this.stripeCustomerService.createCustomer(donateUser)
                stripeCustomerId = newCustomerId

                await this.userRepository.save({
                    id: donateUser.id,
                    ...{ stripeCustomerId }
                });
            }

            const donationReceiver = await this.donationReceiverRepository.findOneBy({ id: params.donationReceiverId })
            let stripeConnectCustomer = await this.stripeConnectCustomersService.findByUserAndDonationReceiver(donateUser, donationReceiver)

            if(!stripeConnectCustomer) {
                const customerForConnectedAccount = await this.stripeCustomerService.cloneCustomerForConnectedAccount(stripeCustomerId, donationReceiver.stripeConnectedAccountId)
                stripeConnectCustomer = await this.stripeConnectCustomersService.create(donateUser, donationReceiver, customerForConnectedAccount.id)
                await this.donationReceiverRepository.save(donationReceiver);

            }

            const intentRes = await this.paymentIntentService.createPaymentIntent(
                params.value,
                stripeConnectCustomer.customerId,
                donationReceiver.stripeConnectedAccountId
            )

            if (!intentRes) {
                throw new BadRequestException('Cannot create Payment')
            }

            const donation = this.donationRepository.create({ ...params, user: donateUser, donationReceiver })
            await this.donationRepository.save(donation);

            return donation;
        } catch (error) {
            console.log("@@@@@@@@@@@@@@error", error)

            throw new BadRequestException(error)
        }
    }
}
