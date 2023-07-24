import { Body, Controller, Get, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { DonationReceiverRegistrationDto } from 'src/donation-receivers/dtos/donation-receiver-registration.dto';
import { DonationReceiversService } from 'src/donation-receivers/services/donation-receivers/donation-receivers.service';

@Controller('donation-receivers')
export class DonationReceiversController {
    constructor(
        private donationRecieverService: DonationReceiversService
    ) { }

    @Post('register')
    async registration(@Body() params: DonationReceiverRegistrationDto, @Req() req): Promise<any> {
        const createdAccount = await this.donationRecieverService.create({ ...params, user: req.user })
        return createdAccount;
    }
}


