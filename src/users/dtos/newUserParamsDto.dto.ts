import { IsNotEmpty, IsNumber, IsString, isNumber } from 'class-validator';

export class NewUserParamsDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    age: number
}