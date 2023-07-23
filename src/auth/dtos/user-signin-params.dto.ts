import { IsEmail, IsNotEmpty, IsNumber, IsString, isNumber } from 'class-validator';

export class UserSigninParamsDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}