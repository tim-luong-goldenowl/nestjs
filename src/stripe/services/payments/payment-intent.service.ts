import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import User from 'src/users/entities/user.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentIntentService {
    constructor(
        @InjectStripe() private readonly stripeClient: Stripe
    ) { }

    async createPaymentIntent(amount: number, customerId: string, stripeAccount: string, metadata: any = {}): Promise<Stripe.Response<Stripe.PaymentIntent>> {
        let customer = await this.retrieveCustomer(customerId, stripeAccount)

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@customerrrrrrrrrrr", customer)

        if (!customer) {
            const token = await this.stripeClient.tokens.create(
                {
                    customer: customerId,
                },
                {
                    stripeAccount: stripeAccount,
                }
            );

            customer = await this.stripeClient.customers.create(
                {
                    source: token.id,
                },
                {
                    stripeAccount: stripeAccount,
                }
            );
        }

        if(!customer) {
            throw BadRequestException
        }

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@customer", customer)

        const res = await this.stripeClient.paymentIntents.create({
            amount,
            currency: 'usd',
            confirm: true,
            metadata,
            customer: customer.id,
        },
            {
                stripeAccount
            }
        )

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@122321321res", res)
        return res;
    }

    async retrieveCustomer(customerId: string, stripeAccountId: string) {
        try {
            return await this.stripeClient.customers.retrieve(customerId, {
                stripeAccount: stripeAccountId
            });
        } catch (error) {
            return false
        }
    }
}
