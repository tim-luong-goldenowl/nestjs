import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { DonationReceiversController } from 'src/donation-receivers/controllers/donation-receivers/donation-receivers.controller';
import { DonationReceiverRegistrationDto } from 'src/donation-receivers/dtos/donation-receiver-registration.dto';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { StripeConnectService } from 'src/stripe/services/stripe-connect/stripe-connect.service';
import { Repository } from 'typeorm';

@Injectable()
export class DonationReceiversService {
    constructor(
        @InjectRepository(DonationReceiver)
        private donationReceiverRepository: Repository<DonationReceiver>,
        private stripeConnectService: StripeConnectService,
        private urlGeneratorService: UrlGeneratorService,


    ) { }

    async create(params: DonationReceiverRegistrationDto): Promise<any> {
        const existingConnectedAccount = await this.donationReceiverRepository.findOne({where: {
            user: params.user
        }})

        if (existingConnectedAccount) {
            throw new HttpException('This user already have a Connected Account', HttpStatus.BAD_REQUEST)
        }

        const connectedAccount = await this.stripeConnectService.createConnectedAccount(params)

        if (connectedAccount.created) {
            const returnUrl = this.urlGeneratorService.generateUrlFromController({
                controller: DonationReceiversController,
                controllerMethod: DonationReceiversController.prototype.registration
            })

            const onboardingLink = await this.stripeConnectService.createAccountLink(connectedAccount.id, returnUrl)

            if (onboardingLink) {
                const donationReceiver = this.donationReceiverRepository.create(params)
                await this.donationReceiverRepository.save(donationReceiver);

                return {...donationReceiver, onboardingLink};
            } else {
                throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST)
            }
        } else {
            throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST)
        }
    }
}
