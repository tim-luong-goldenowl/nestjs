import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserProfileDto {
    @IsNotEmpty()
    @IsString()
    @Expose()
    firstName: string

    @IsNotEmpty()
    @Expose()
    @IsString()
    lastName: string
    
    @Expose()
    dob: Date

    @Expose()
    @IsNotEmpty()
    id: number
    
    @IsString()
    @Expose()
    @IsNotEmpty()
    email: string
}