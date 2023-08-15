import { IsNotEmpty, IsNumber } from 'class-validator';

export class RegisterCompletedParams {
    @IsNumber()
    id: number
}