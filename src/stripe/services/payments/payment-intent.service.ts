import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import User from 'src/users/entities/user.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentIntentService {
    constructor(
        @InjectStripe() private readonly stripeClient: Stripe
    ) { }

    async createPaymentIntent(amount: number, customerId: string, metadata: any = {}): Promise<Stripe.Response<Stripe.PaymentIntent>> {
        const res = await this.stripeClient.paymentIntents.create({
            amount,
            currency: 'usd',
            confirm: true,
            metadata,
            customer: customerId
        })

        return res;
    }
}
