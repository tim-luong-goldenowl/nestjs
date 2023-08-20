import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { STRIPE_MICROSERVICE_CREATE_CUSTOMER_MESSAGE, STRIPE_MICROSERVICE_NAME } from 'src/constants';
import User from 'src/users/entities/user.entity';
import { CreateCustomerCardResponseType } from 'src/users/microservice-response-types';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class UserStripeCustomerService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(STRIPE_MICROSERVICE_NAME) private readonly stripeMicroserviceClient: ClientProxy,
    ) { }

    async createCustomerAndCard(cardToken: string, user: User): Promise<any> {
        const result = await lastValueFrom(this.stripeMicroserviceClient.send(STRIPE_MICROSERVICE_CREATE_CUSTOMER_MESSAGE, { cardToken, user }))

        if (result.stripeCustomerId != user.stripeCustomerId) {
            await this.userRepository.save({
                id: user.id,
                ...{ stripeCustomerId: result.stripeCustomerId }
            });
        }

        return result
    }
}
