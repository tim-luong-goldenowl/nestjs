import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserDto {
    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsString()
    lastName: string

    dob?: Date

    @IsNumber()
    @IsNotEmpty()
    id: number

    
    @IsString()
    @IsNotEmpty()
    email: string
}