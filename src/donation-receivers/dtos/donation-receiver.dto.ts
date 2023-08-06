import { IsEmail, IsNotEmpty, IsNumber, IsString, isNumber } from 'class-validator';
import User from 'src/users/entities/user.entity';

export class DonationReceiverDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    businessName: string

    @IsNotEmpty()
    companyName: string

    @IsNotEmpty()
    country: string

    @IsNumber()
    @IsNotEmpty()
    id: number

    onboardingCompleteToken: string
    user: User
}