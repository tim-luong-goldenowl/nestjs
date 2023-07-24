import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { DonationReceiverRegistrationDto } from 'src/donation-receivers/dtos/donation-receiver-registration.dto';
import Stripe from 'stripe';

@Injectable()
export class StripeConnectService {
    constructor(
        @InjectStripe() private readonly stripeClient: Stripe,
        private readonly urlGeneratorService: UrlGeneratorService
    ) {}

    async createConnectedAccount(params: DonationReceiverRegistrationDto) {
        const account = await this.stripeClient.accounts.create({
            type: 'standard',
            country: params.country,
            email: params.email,
            business_type: 'individual',
            business_profile: {
                name: params.businessName
            },
            company: {
                name: params.companyName
            }
        });

        return account;
    }


    async createAccountLink(accountId: string, returnUrl: string) {
        const accountLink = await this.stripeClient.accountLinks.create({
            account: accountId,
            refresh_url: 'https://example.com/reauth',
            return_url: returnUrl,
            type: 'account_onboarding',
        });

        return accountLink;
    }
}
