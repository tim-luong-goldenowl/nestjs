import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { DonationReceiversController } from 'src/donation-receivers/controllers/donation-receivers/donation-receivers.controller';
import { DonationReceiverRegistrationDto } from 'src/donation-receivers/dtos/donation-receiver-registration.dto';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { StripeConnectService } from 'src/stripe/services/stripe-connect/stripe-connect.service';
import { Repository } from 'typeorm';
import {randomBytes} from 'crypto';

@Injectable()
export class DonationReceiversService {
    constructor(
        @InjectRepository(DonationReceiver)
        private donationReceiverRepository: Repository<DonationReceiver>,
        private stripeConnectService: StripeConnectService,
        private urlGeneratorService: UrlGeneratorService
    ) { }

    async getAll() {
        return this.donationReceiverRepository.find({})
    }
    
    async create(params: DonationReceiverRegistrationDto): Promise<any> {
        const existingConnectedAccount = await this.donationReceiverRepository.findOne({
            where: {
                user: params.user
            }
        })

        if (existingConnectedAccount) {
            throw new HttpException('This user already have a Connected Account', HttpStatus.BAD_REQUEST)
        }

        const connectedAccount = await this.stripeConnectService.createConnectedAccount(params)

        if (connectedAccount.created) {
            const onboardingCompleteToken = randomBytes(20).toString('hex')
            const donationReceiver = this.donationReceiverRepository.create({ ...params, onboardingCompleteToken })

            const returnUrl = this.urlGeneratorService.generateUrlFromController({
                controller: DonationReceiversController,
                controllerMethod: DonationReceiversController.prototype.registerCompleted,
                query: { onboardingCompleteToken }
            })

            const onboardingLink = await this.stripeConnectService.createAccountLink(connectedAccount.id, returnUrl)

            if (onboardingLink) {
                await this.donationReceiverRepository.save(donationReceiver);
                return { ...donationReceiver, onboardingLink };
            } else {
                throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST)
            }
        } else {
            throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST)
        }
    }

    async complete(token: string) {
        const donationReceiver = await this.donationReceiverRepository.findOne({
            where: {
                onboardingCompleteToken: token
            }
        })

        if(donationReceiver) {
            this.donationReceiverRepository.update(donationReceiver, {verified: true})
        }
    }
}
