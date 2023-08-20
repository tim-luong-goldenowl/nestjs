import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import DonationReceiver from '../../entities/donation-receiver.entity';
import { DonationReceiverRegistrationDto } from '../../dtos/donation-receiver-registration.dto';
import { StripeConnectService } from 'src/stripe/services/stripe-connect/stripe-connect.service';
import { S3Service } from 'src/s3/s3.service';
import { SEND_MAIL_QUEUE_NAME, SEND_ONBOARDING_LINK_JOB_NAME } from 'src/constants';
import User from 'src/users/entities/user.entity';
import { CreateConnectedAccountResponse } from 'src/stripe/types';

@Injectable()
export class DonationReceiversService {
    public get sendMailQueue(): Queue {
        return this._sendMailQueue;
    }
    public set sendMailQueue(value: Queue) {
        this._sendMailQueue = value;
    }
    constructor(
        @InjectRepository(DonationReceiver)
        private donationReceiverRepository: Repository<DonationReceiver>,
        private stripeConnectService: StripeConnectService,
        private s3Service: S3Service,
        @InjectQueue(SEND_MAIL_QUEUE_NAME)
        private _sendMailQueue: Queue
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

    async processVerifyForDonationReceiver(id: number): Promise<any> {
        const donationReceiver = await this.donationReceiverRepository.findOne({
            where: {
                id,
                verified: false
            }
        })

        if (!donationReceiver) {
            throw new BadRequestException
        }

        const onboardingCompleteToken = randomBytes(20).toString('hex')
        const returnUrl = `http://localhost:3001/users/completed-dr-registration/${onboardingCompleteToken}`

        const connectedAccountResult: CreateConnectedAccountResponse = await this.stripeConnectService.createConnectedAccount(donationReceiver, { returnUrl })

        if (connectedAccountResult.success) {
            const onboardingLink = connectedAccountResult.onboardingLink

            await this.donationReceiverRepository.save({
                id,
                onboardingCompleteToken,
                stripeConnectedAccountId: connectedAccountResult.connectedAccountId
            });

            this.sendMailQueue.add(SEND_ONBOARDING_LINK_JOB_NAME, { donationReceiver, onboardingLink: connectedAccountResult.onboardingLink });
            return onboardingLink;
        } else {
            return false
        }
    }

    async complete(token: string): Promise<boolean> {
        const donationReceiver = await this.donationReceiverRepository.findOne({
            where: {
                onboardingCompleteToken: token
            }
        })

        if (donationReceiver) {
            this.donationReceiverRepository.update(donationReceiver, { verified: true, onboardingCompleteToken: null })
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