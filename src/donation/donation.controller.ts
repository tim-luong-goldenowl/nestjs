import { Body, Controller, Post, Req } from '@nestjs/common';
import { DonationDto } from './donation.dto';
import { DonationService } from './donation.service';

@Controller('donation')
export class DonationController {
    constructor(
        private donationService: DonationService
    ) {}

    @Post()
    async createDonation(@Body() params: DonationDto, @Req() req) {
        console.log("@@@@@@@@@params", params)
        const donation = await this.donationService.create(params, req.user);

        return donation;
    }
}
