import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import User from 'src/users/entities/user.entity';
import Stripe from 'stripe';

@Injectable()
export class StripeCustomerService {
    constructor(
        @InjectStripe() private readonly stripeClient: Stripe
    ) { }

    async createCustomer(user: User): Promise<string> {
        const res = await this.stripeClient.customers.create({
            email: user.email
        })

        return res.id
    }

    async createCustomerCard(customerId: string, cardToken: string): Promise<Stripe.Response<Stripe.CustomerSource>> {
        const res = await this.stripeClient.customers.createSource(customerId, {
            source: cardToken
        })

        return res
    }

    async getPaymentMethod(customerId: string): Promise<Stripe.ApiListPromise<Stripe.CustomerSource>> {
        const res = await this.stripeClient.customers.listSources(customerId, {
            object: 'card',
            limit: 1
        })

        return res
    }
}
