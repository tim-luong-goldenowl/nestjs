import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import User from 'src/users/entities/user.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentIntentService {
    constructor(
        @InjectStripe() private readonly stripeClient: Stripe
    ) {}

    async createPaymentIntent(amount: number, customerId: string, metadata: any = {}) {
        const res = await this.stripeClient.paymentIntents.create({
            amount,
            currency: 'usd',
            confirm: false,
            metadata,
            customer: customerId
        })

        return res;
    }

    async createCustomer(user: User) {
        const res = await this.stripeClient.customers.create({
            email: user.email
        })

        return res.id
    }
}
