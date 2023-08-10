import { BadRequestException, Injectable } from '@nestjs/common';
import { DonationDto } from './donation.dto';
import Donation from './donation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from 'src/users/entities/user.entity';
import { PaymentIntentService } from 'src/stripe/services/payments/payment-intent.service';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';

@Injectable()
export class DonationService {
    constructor(
        @InjectRepository(Donation)
        private donationRepository: Repository<Donation>,
        private paymentIntentService: PaymentIntentService,
        @InjectRepository(DonationReceiver) private donationReceiverRepository: Repository<DonationReceiver>
    ) { }

    async create(params: DonationDto, donateUser: User): Promise<any> {
        try {
            const intentRes = await this.paymentIntentService.createPaymentIntent(
                params.value
            )

            console.log("@@@@@@@@@intentRes", intentRes)
            // const donationReceiver = await this.donationReceiverRepository.findOneBy({ id: params.donationReceiverId })
            // const donation = this.donationRepository.create({ ...params, user: donateUser, donationReceiver })
            // await this.donationRepository.save(donation);

            // return donation;
        } catch (error) {
            throw new BadRequestException(error)
        }
    }
}
