import { IsEmail, IsNotEmpty, IsNumber, IsString, isNumber } from 'class-validator';

export class UserRegistrationParamsDto {
    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}