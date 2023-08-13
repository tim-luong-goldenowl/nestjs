import { Injectable } from '@nestjs/common';
import Donation from './donation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class DonationService {
    constructor(
        @InjectRepository(Donation)
        private donationRepository: Repository<Donation>,
    ) { }

    async getDonationCount(donationReceiverId: number): Promise<number> {
        const count = await this.donationRepository.createQueryBuilder('donations').where('donations.donationReceiverId = :donationReceiverId', { donationReceiverId }).getCount()
        console.log("@@@@@@@@@@@@count", count)

        return count
    }
}
