import { Body, Controller, Get, Query, Post, Req, Put, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/auth.decorator';
import { RegisterCompletedParams } from 'src/donation-receivers/dtos/complete-params.dto';
import { DonationReceiverRegistrationDto } from 'src/donation-receivers/dtos/donation-receiver-registration.dto';
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
        const data = await this.donationRecieverService.getVerified()

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
    async registration(@Req() req): Promise<any> {
        const donationReceiver = await this.donationRecieverService.create(req.user)
        return donationReceiver;
    }

    @Public()
    @Get('register-completed')
    async registerCompleted(@Query() query: RegisterCompletedParams) {
        const token = query.onboardingCompleteToken;
        return await this.donationRecieverService.complete(token)
    }
    @Put('/update-profile')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateProfile(@Body() params, @UploadedFile() avatar) {
        const user = await this.donationRecieverService.update(params, avatar);
        return user;
    }
}


