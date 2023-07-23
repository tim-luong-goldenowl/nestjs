import { Body, Controller, Get, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { DonationReceiverRegistrationDto } from 'src/donation-receivers/dtos/donation-receiver-registration.dto';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { DonationReceiversService } from 'src/donation-receivers/services/donation-receivers/donation-receivers.service';
import { StripeConnectService } from 'src/stripe/services/stripe-connect/stripe-connect.service';

@Controller('donation-receivers')
export class DonationReceiversController {
    constructor(
        private donationRecieverService: DonationReceiversService
    ) { }


    @Post('registration')
    async registration(@Body() params: DonationReceiverRegistrationDto, @Req() req): Promise<any> {

        const createdAccount = await this.donationRecieverService.create({ ...params, user: req.user })
        return createdAccount;

        // if (createdAccount) {
        //     const onboardingLink = await this.stripeConnectService.createAccountLink(createdAccount.id)
        //     return {
        //         onboardingLink
        //     }
        // } else {
        //     throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST)
        // }
    }
}


