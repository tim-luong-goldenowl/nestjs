import { Body, Controller, Post, Req } from '@nestjs/common';
import { DonationDto } from './donation.dto';
import { DonationService } from './donation.service';
import { CreateDonationService } from './create-donation.service';

@Controller('donation')
export class DonationController {
    constructor(
        private donationService: DonationService,
        private createDonationService: CreateDonationService
    ) { }

    @Post()
    async createDonation(@Body() params: DonationDto, @Req() req) {
        const donation = await this.createDonationService.create(params, req.user)
        const donationCount = await this.donationService.getDonationCount(params.donationReceiverId)

        if (donation) {
            return {
                success: true,
                data: {
                    donation,
                    donationCount
                }
            };
        } else {
            return {
                success: false
            };
        }
    }
}
