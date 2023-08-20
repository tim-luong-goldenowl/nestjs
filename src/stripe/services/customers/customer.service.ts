import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectStripe } from 'nestjs-stripe';
import User from 'src/users/entities/user.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class StripeCustomerService {
    constructor(
        @InjectStripe() private readonly stripeClient: Stripe,
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    async createCustomer(user: User): Promise<string> {
        const res = await this.stripeClient.customers.create({
            email: user.email
        })

        return res.id
    }

    async createCustomerCard(cardToken: string, user: User): Promise<Stripe.Response<Stripe.CustomerSource>> {
        let stripeCustomerId = user.stripeCustomerId

        if (!stripeCustomerId) {
            stripeCustomerId = await this.createCustomer(user)

            await this.userRepository.save({
                id: user.id,
                ...{ stripeCustomerId }
            });
        }

        const res = await this.stripeClient.customers.createSource(stripeCustomerId, {
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

    async cloneCustomerForConnectedAccount(customerId: string, stripeAccount) {
        let customer = await this.retrieveCustomer(customerId, stripeAccount)

        if (customer) {
            return customer
        } else {
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

            return customer;
        }

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
