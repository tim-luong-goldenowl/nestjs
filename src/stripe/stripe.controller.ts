import { BadRequestException, Body, Controller, Get, Param, Post, Req, SerializeOptions } from '@nestjs/common';
import { StripeCustomerService } from './services/customers/customer.service';
import { CreateCustomerCardDto } from './dtos/createCustomerCard.dto';
import { GetPaymentMethodDto } from './dtos/getPaymentMethod.dto';

@Controller('stripe')
export class StripeController {
    constructor(
        private stripeCustomerService: StripeCustomerService
    ) { }

    @Post('/create-customer-card')
    async createCustomerCard(@Body() params: CreateCustomerCardDto) {
        const cardInfor = await this.stripeCustomerService.createCustomerCard(params.customerId, params.cardToken);

        return cardInfor;
    }

    @Get('/get-payment-method/:customerId')
    async getPaymentMethod(@Param() params: GetPaymentMethodDto) {
        const paymentMethod = await this.stripeCustomerService.getPaymentMethod(params.customerId);

        if (paymentMethod) {
            const firstPaymentMethod: any = paymentMethod.data.at(0)

            const {
                id,
                last4,
                brand,
                country,
            } = firstPaymentMethod

            return {
                success: true,
                data: {
                    id,
                    last4,
                    brand,
                    country,
                }
            }
        } else {
            return {
                success: false
            }
        }

    }
}
