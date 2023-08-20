
import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { CreateConnectedAccountOptions, CreateConnectedAccountResponse } from '../../types';
import { DonationReceiverRegistrationDto } from 'src/donation-receivers/dtos/donation-receiver-registration.dto';

@Injectable()
export class StripeConnectService {
    constructor(
        @InjectStripe() private readonly stripeClient: Stripe
    ) { }

    async createConnectedAccount(params: DonationReceiverRegistrationDto, options: CreateConnectedAccountOptions): Promise<CreateConnectedAccountResponse> {
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

        if (account.created) {
            const onboardingLink = await this.createAccountOnboardingLink(account.id, options.returnUrl)

            return {
                success: true,
                onboardingLink,
                connectedAccountId: account.id
            }
        } else {
            return {
                success: false
            }
        }
    }


    async createAccountOnboardingLink(accountId: string, returnUrl: string): Promise<string> {
        const accountLink = await this.stripeClient.accountLinks.create({
            account: accountId,
            refresh_url: 'https://example.com/reauth',
            return_url: returnUrl,
            type: 'account_onboarding',
        });

        return accountLink.url;
    }
}