import { IsNotEmpty, IsString } from 'class-validator';

export class GetPaymentMethodDto {
    @IsNotEmpty()
    @IsString()
    customerId: string
}