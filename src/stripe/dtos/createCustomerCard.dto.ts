import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerCardDto {
    @IsNotEmpty()
    @IsString()
    cardToken: string

    @IsString()
    @IsNotEmpty()
    customerId: string
}