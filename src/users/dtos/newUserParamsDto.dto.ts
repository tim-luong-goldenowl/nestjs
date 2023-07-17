import { IsNotEmpty, IsString } from 'class-validator';

export class NewUserParamsDto {
    @IsString()
    name: string
    age: number
    male: boolean
}