import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import User from 'src/users/entities/user.entity';
import Stripe from 'stripe';
import { StripeCustomerService } from '../customers/customer.service';

@Injectable()
export class PaymentIntentService {
    constructor(
        @InjectStripe() private readonly stripeClient: Stripe,
        private stripeCustomerService: StripeCustomerService,
    ) { }

    async createPaymentIntent(amount: number, customerId: string, stripeAccount: string, metadata: any = {}): Promise<Stripe.Response<Stripe.PaymentIntent>> {
        let customer = await this.stripeCustomerService.retrieveCustomer(customerId, stripeAccount)

        const res = await this.stripeClient.paymentIntents.create({
            amount,
            currency: 'usd',
            confirm: true,
            metadata,
            customer: customerId,
        },
            {
                stripeAccount
            }
        )

        return res;
    }
}
