import { Body, Controller, Get, Inject, Post, Put, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { lastValueFrom } from 'rxjs';
import { STRIPE_MICROSERVICE_CREATE_CUSTOMER_MESSAGE, STRIPE_MICROSERVICE_GET_CUSTOMER_CARD_MESSAGE, STRIPE_MICROSERVICE_GET_CUSTOMER_CARD_MESSAGEA, STRIPE_MICROSERVICE_NAME } from 'src/constants';
import { UpdateUserProfileDto } from 'src/users/dtos/update-user-profile.dto';
import { UserStripeCustomerService } from 'src/users/services/user-stripe-customer.service';
import { UsersService } from 'src/users/services/users.service';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
        private userStripeCustomerService: UserStripeCustomerService,
        @Inject(STRIPE_MICROSERVICE_NAME) private readonly stripeMicroserviceClient: ClientProxy,
    ) { }

    @Get('/me')
    async me(@Req() req) {
        const user = await this.userService.findOneById(req.user.id);
        return user;
    }

    @Get('/profiles')
    async profiles(@Req() req) {
        const profiles = await this.userService.getProfiles(req.user.id)

        return profiles
    }

    @Put('/update-profile')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateProfile(@Body() params: UpdateUserProfileDto, @UploadedFile() avatar) {
        const DtoParams = plainToInstance(UpdateUserProfileDto, params, { excludeExtraneousValues: true, enableImplicitConversion: true })
        const user = await this.userService.updateUser(DtoParams, avatar);
        return user;
    }

    @Get('/get-payment-method')
    async getPaymentMethod(@Req() req) {
        const paymentMethod = await lastValueFrom(this.stripeMicroserviceClient.send(STRIPE_MICROSERVICE_GET_CUSTOMER_CARD_MESSAGE, { user: req.user }))
        return paymentMethod
    }

    @Post('/create-customer-card')
    async createCustomerCard(@Body() params, @Req() req) {
        const result = await this.userStripeCustomerService.createCustomerAndCard(params.cardToken, req.user)

        if (result) {
            return {
                success: true
            }
        } else {
            return {
                success: false
            }
        }
    }
}
