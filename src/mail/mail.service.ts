import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import User from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendStripeConnectOnboardingLink(user: User, onboardingUrl: string) {
        await this.mailerService.sendMail({
            to: 'timdemo@mailinator.com',
            subject: 'Welcome to Nice App! Confirm your Email',
            template: './onboarding-link',
            context: {
                name: user.firstName,
                url: onboardingUrl,
            },
        });
    }
}
