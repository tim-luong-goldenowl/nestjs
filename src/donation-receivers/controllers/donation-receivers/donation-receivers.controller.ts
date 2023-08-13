import { Body, Controller, Get, HttpException, HttpStatus, Query, Post, Req, Put, Param } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { RegisterCompletedParams } from 'src/donation-receivers/dtos/complete-params.dto';
import { DonationReceiverRegistrationDto } from 'src/donation-receivers/dtos/donation-receiver-registration.dto';
import { DonationReceiverDto } from 'src/donation-receivers/dtos/donation-receiver.dto';
import { DonationReceiversService } from 'src/donation-receivers/services/donation-receivers/donation-receivers.service';
import { DonationService } from 'src/donation/donation.service';

@Controller('donation-receivers')
export class DonationReceiversController {
    constructor(
        private donationRecieverService: DonationReceiversService,
        private donationService: DonationService
    ) { }

    @Get()
    async getDonationReceivers() {
        const data = await this.donationRecieverService.getAll()

        return {
            data
        }
    }

    @Get('/:id')
    async getById(@Param() query) {
        const data = await this.donationRecieverService.getById(query.id)
        const donationCount = await this.donationService.getDonationCount(query.id)

        return {
            data: {
                ...data,
                donationCount
            }
        }
    }

    @Post('register')
    async registration(@Body() params: DonationReceiverRegistrationDto, @Req() req): Promise<any> {
        const createdAccount = await this.donationRecieverService.create({ ...params, user: req.user })
        return createdAccount;
    }

    @Public()
    @Get('register-completed')
    async registerCompleted(@Query() query: RegisterCompletedParams) {
        const token = query.onboardingCompleteToken;
        return await this.donationRecieverService.complete(token)
    }

    @Put('/update-profile')
    async updateProfile(@Body() params: DonationReceiverDto) {
        const user = await this.donationRecieverService.update(params);
        return user;
    }
}


