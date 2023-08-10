import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';

@Injectable()
export class PaymentIntentService {
    constructor(
        @InjectStripe() private readonly stripeClient: Stripe
    ) {}

    async createPaymentIntent(amount: number, metadata: any = {}) {
        const res = await this.stripeClient.paymentIntents.create({
            amount,
            currency: 'usd',
            confirm: false,
            metadata
        })

        return res;
    }
}
