import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationReceiverRegistrationDto } from 'src/donation-receivers/dtos/donation-receiver-registration.dto';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DonationReceiversService {
    constructor(
        @InjectRepository(DonationReceiver)
        private donationReceiverRepository: Repository<DonationReceiver>
    ) { }

    async create(params: DonationReceiverRegistrationDto): Promise<DonationReceiver> {
        const donationReceiver = await this.donationReceiverRepository.create(params)
        this.donationReceiverRepository.save(donationReceiver);
        return donationReceiver;
    }
}
