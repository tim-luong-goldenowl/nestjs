import { IsNotEmpty, IsNumber} from 'class-validator';

export class DonationDto {
    @IsNotEmpty()
    message: string

    @IsNotEmpty()
    @IsNumber()
    value: number

    @IsNotEmpty()
    donationReceiverId: number
}