import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendStripeConnectOnboardingLink(donationReceiver: DonationReceiver, onboardingUrl: string) {
        await this.mailerService.sendMail({
            to: donationReceiver.email,
            subject: 'Donation onboarding link',
            template: './onboarding-link',
            context: {
                name: donationReceiver.businessName,
                url: onboardingUrl,
            },
        });
    }
}
