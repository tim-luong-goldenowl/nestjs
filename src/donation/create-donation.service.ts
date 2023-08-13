import { BadRequestException, Injectable } from '@nestjs/common';
import { DonationDto } from './donation.dto';
import Donation from './donation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import User from 'src/users/entities/user.entity';
import { PaymentIntentService } from 'src/stripe/services/payments/payment-intent.service';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { StripeCustomerService } from 'src/stripe/services/customers/customer.service';

@Injectable()
export class CreateDonationService {
    constructor(
        @InjectRepository(Donation)
        private donationRepository: Repository<Donation>,
        private paymentIntentService: PaymentIntentService,
        private stripeCustomerService: StripeCustomerService,
        @InjectRepository(DonationReceiver) private donationReceiverRepository: Repository<DonationReceiver>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    async create(params: DonationDto, donateUser: User): Promise<Donation> {
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

            // const intentRes = await this.paymentIntentService.createPaymentIntent(
            //     params.value,
            //     stripeCustomerId
            // )

            // if (!intentRes) {
            //     throw new BadRequestException('Cannot create Payment')
            // }

            const donationReceiver = await this.donationReceiverRepository.findOneBy({ id: params.donationReceiverId })
            const donation = this.donationRepository.create({ ...params, user: donateUser, donationReceiver })
            await this.donationRepository.save(donation);

            return donation;
        } catch (error) {
            throw new BadRequestException(error)
        }
    }
}
