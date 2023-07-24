import { IsNotEmpty } from 'class-validator';

export class RegisterCompletedParams {
    @IsNotEmpty()
    onboardingCompleteToken: string
}