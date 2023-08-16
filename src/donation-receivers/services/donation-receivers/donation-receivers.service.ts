import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlGeneratorService } from 'nestjs-url-generator';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { StripeConnectService } from 'src/stripe/services/stripe-connect/stripe-connect.service';
import { Not, Repository } from 'typeorm';
import { S3Service } from 'src/s3/s3.service';
import User from 'src/users/entities/user.entity';
import { DonationReceiverRegistrationDto } from 'src/donation-receivers/dtos/donation-receiver-registration.dto';
import { randomBytes } from 'crypto';
import { DonationReceiversController } from 'src/donation-receivers/controllers/donation-receivers/donation-receivers.controller';
import Stripe from 'stripe';

@Injectable()
export class DonationReceiversService {
    constructor(
        @InjectRepository(DonationReceiver)
        private donationReceiverRepository: Repository<DonationReceiver>,
        private stripeConnectService: StripeConnectService,
        private s3Service: S3Service
    ) { }

    async getVerified(user: User) {
        return this.donationReceiverRepository.find({
            where: {
                verified: true,
                user: Not(user.id)
            }
        })
    }

    async getById(id: number) {
        return this.donationReceiverRepository.findOne({
            where: {
                id
            }
        })
    }

    async create(user: User): Promise<any> {
        const existingConnectedAccount = await this.donationReceiverRepository.findOne({
            where: {
                user: user
            }
        })

        if (existingConnectedAccount) {
            throw new HttpException('This user already have a Connected Account', HttpStatus.BAD_REQUEST)
        }


        const donationReceiver = this.donationReceiverRepository.create({ user: user })
        return await this.donationReceiverRepository.save(donationReceiver);
    }

    async createConnectedAccount(id: number): Promise<Stripe.Response<Stripe.AccountLink>> {
        const donationReceiver = await this.donationReceiverRepository.findOne({
            where: {
                id,
                verified: false
            }
        })

        if(!donationReceiver) {
            throw new BadRequestException
        }

        const connectedAccount = await this.stripeConnectService.createConnectedAccount(donationReceiver)

        if (connectedAccount.created) {
            const stripeConnectedAccountId = connectedAccount.id

            const onboardingCompleteToken = randomBytes(20).toString('hex')

            const returnUrl = `http://localhost:3001/users/completed-dr-registration/${onboardingCompleteToken}`

            const onboardingLink = await this.stripeConnectService.createAccountLink(connectedAccount.id, returnUrl)

            if (onboardingLink) {
                await this.donationReceiverRepository.save({
                    id,
                    onboardingCompleteToken,
                    stripeConnectedAccountId
                });
                return onboardingLink;
            } else {
                throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST)
            }
        } else {
            throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST)
        }
    }

    async complete(token: string): Promise<boolean> {
        const donationReceiver = await this.donationReceiverRepository.findOne({
            where: {
                onboardingCompleteToken: token
            }
        })

        if (donationReceiver) {
            this.donationReceiverRepository.update(donationReceiver, { verified: true })
            return true
        }
        
        return false
    }

    async update(params: DonationReceiverRegistrationDto, avatar: Express.Multer.File): Promise<any> {
        try {
            console.log(params)

            const donationReceiver = await this.donationReceiverRepository.findOne({
                where: {
                    id: params.id
                }
            })


            if (avatar) {
                const oldAvatarUrl = donationReceiver.avatarUrl;

                if (oldAvatarUrl) {
                    const oldAvatarFileName = oldAvatarUrl[oldAvatarUrl.length - 1]
                    const uploadedFileUrl = await this.s3Service.replaceObject(avatar, oldAvatarFileName)
                    params.avatarUrl = uploadedFileUrl
                } else {
                    const uploadedFileUrl = await this.s3Service.createObject(avatar)
                    params.avatarUrl = uploadedFileUrl
                }
            }

            return await this.donationReceiverRepository.save({
                id: params.id,
                ...params
            });
        } catch (error) {
            throw new BadRequestException
        }
    }
}
