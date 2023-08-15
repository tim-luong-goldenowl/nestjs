import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { DonationReceiversController } from 'src/donation-receivers/controllers/donation-receivers/donation-receivers.controller';
import { DonationReceiverRegistrationDto } from 'src/donation-receivers/dtos/donation-receiver-registration.dto';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { StripeConnectService } from 'src/stripe/services/stripe-connect/stripe-connect.service';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { DonationReceiverDto } from 'src/donation-receivers/dtos/donation-receiver.dto';
import { S3Service } from 'src/s3/s3.service';
import User from 'src/users/entities/user.entity';

@Injectable()
export class DonationReceiversService {
    constructor(
        @InjectRepository(DonationReceiver)
        private donationReceiverRepository: Repository<DonationReceiver>,
        private stripeConnectService: StripeConnectService,
        private urlGeneratorService: UrlGeneratorService,
        private s3Service: S3Service
    ) { }

    async getVerified() {
        return this.donationReceiverRepository.find({
            where: {
                verified: true
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

    // async createConnectedAccount(user: User): Promise<any> {
    //     const existingConnectedAccount = await this.donationReceiverRepository.findOne({
    //         where: {
    //             user: user
    //         }
    //     })

    //     if (existingConnectedAccount) {
    //         throw new HttpException('This user already have a Connected Account', HttpStatus.BAD_REQUEST)
    //     }

    //     const connectedAccount = await this.stripeConnectService.createConnectedAccount(params)

    //     if (connectedAccount.created) {
    //         const onboardingCompleteToken = randomBytes(20).toString('hex')
    //         const donationReceiver = this.donationReceiverRepository.create({ ...params, onboardingCompleteToken })

    //         const returnUrl = this.urlGeneratorService.generateUrlFromController({
    //             controller: DonationReceiversController,
    //             controllerMethod: DonationReceiversController.prototype.registerCompleted,
    //             query: { onboardingCompleteToken }
    //         })

    //         const onboardingLink = await this.stripeConnectService.createAccountLink(connectedAccount.id, returnUrl)

    //         if (onboardingLink) {
    //             await this.donationReceiverRepository.save(donationReceiver);
    //             return { ...donationReceiver, onboardingLink };
    //         } else {
    //             throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST)
    //         }
    //     } else {
    //         throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST)
    //     }
    // }

    async complete(token: string) {
        const donationReceiver = await this.donationReceiverRepository.findOne({
            where: {
                onboardingCompleteToken: token
            }
        })

        if (donationReceiver) {
            this.donationReceiverRepository.update(donationReceiver, { verified: true })
        }
    }

    async update(params: any, avatar: Express.Multer.File): Promise<DonationReceiver> {
        try {
            const updateParams: DonationReceiver = {
                ...params
            }

            const id = parseInt(params.id.toString())
            delete updateParams['id']
            delete updateParams['user']

            console.log('@@@@@@@@@@@@@params', updateParams)

            const donationReceiver = await this.donationReceiverRepository.findOne({
                where: {
                    id
                }
            })

            if (avatar) {
                const oldAvatarUrl = donationReceiver.avatarUrl;

                if(oldAvatarUrl) {
                    const oldAvatarFileName = oldAvatarUrl[oldAvatarUrl.length - 1]
                    const uploadedFileUrl = await this.s3Service.replaceObject(avatar, oldAvatarFileName)
                    updateParams.avatarUrl = uploadedFileUrl
                } else {
                    const uploadedFileUrl = await this.s3Service.createObject(avatar)
                    updateParams.avatarUrl = uploadedFileUrl
                }
            }

            return await this.donationReceiverRepository.save({
                id,
                ...updateParams
            });
        } catch (error) {
            console.log('@@@@@@@@@@@@@error', error)
            throw new BadRequestException
        }
    }
}
