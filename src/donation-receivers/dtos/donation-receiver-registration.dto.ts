import { IsEmail, IsNotEmpty, IsNumber, IsString, isNumber } from 'class-validator';
import User from 'src/users/entities/user.entity';

export class DonationReceiverRegistrationDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNumber()
    id: number

    @IsNotEmpty()
    businessName: string

    @IsNotEmpty()
    companyName: string

    @IsNotEmpty()
    country: string

    onboardingCompleteToken: string
    user: User
}