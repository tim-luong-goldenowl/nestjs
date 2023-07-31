import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/services/users/users.service';
import { UserRegistrationParamsDto } from './dtos/user-registration-params.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) { }

    @Public()
    @Post('register')
    async register(@Body() params: UserRegistrationParamsDto): Promise<any> {
        const encryptedPassword = await bcrypt.hash(params.password, 10);

        const createdUser = await this.userService.createUser({ ...params, password: encryptedPassword });

        return createdUser;
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('signin')
    async signin(@Request() req) {
        const jwtToken = await this.authService.login(req.user);

        return {
            token: jwtToken
        };
    }
}
