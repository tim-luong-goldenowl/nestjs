import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, Query, Post, Req, Put, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bull';
import { plainToInstance } from 'class-transformer';
import { Public } from 'src/auth/auth.decorator';
import { DonationReceiverRegistrationDto } from 'src/donation-receivers/dtos/donation-receiver-registration.dto';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { DonationReceiversService } from 'src/donation-receivers/services/donation-receivers/donation-receivers.service';
import { DonationService } from 'src/donation/donation.service';
import { MailService } from 'src/mail/mail.service';
import User from 'src/users/entities/user.entity';
import Stripe from 'stripe';

@Controller('donation-receivers')
export class DonationReceiversController {
    constructor(
        private donationRecieverService: DonationReceiversService,
        private donationService: DonationService,
        private mailService: MailService,
        @InjectQueue('send-mail-queue') private sendMailQueue: Queue
    ) {}

    @Get()
    async getDonationReceivers(@Req() req) {
        const data = await this.donationRecieverService.getVerified(req.user)

        return {
            data
        }
    }

    @Get('/:id')
    async getById(@Param() query, @Req() req) {
        const data = await this.donationRecieverService.getById(query.id)
        const donationCount = await this.donationService.getDonationCount(query.id)

        return {
            data: {
                ...data,
                donationCount,
            },
            canMakeDonate: req.user.stripeCustomerId.length
        }
    }

    @Post('register')
    async registration(@Req() req): Promise<DonationReceiver> {
        const donationReceiver = await this.donationRecieverService.create(req.user)
        return donationReceiver;
    }

    @Post('verify')
    async verify(@Body() body, @Req() req): Promise<any> {
        const onboardingLink = await this.donationRecieverService.processVerifyForDonationReceiver(body.id)

        if (onboardingLink) {
            return {
                success: true
            }
        } else {
            return {
                success: false
            }
        }
    }

    @Public()
    @Get('register-completed/:token')
    async registerCompleted(@Param() query: any) {
        const token = query.token;
        const success: boolean = await this.donationRecieverService.complete(token)

        return {
            success
        }
    }

    @Put('/update-profile')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateProfile(@Body() params: DonationReceiverRegistrationDto, @UploadedFile() avatar) {
        const DtoParams = plainToInstance(DonationReceiverRegistrationDto, params, { excludeExtraneousValues: true, enableImplicitConversion: true })

        const donationReceiver = await this.donationRecieverService.update(DtoParams, avatar);
        return donationReceiver;
    }
}


