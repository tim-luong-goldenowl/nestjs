import { Body, Controller, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
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
    @Post('sign-in')
    async signIn(@Request() req, @Response() res) {
        const jwtToken = await this.authService.login(req.user);

        res.cookie('token', jwtToken, {
            expires: new Date(new Date().getTime() + 7200000),
            httpOnly: true,
            secure: false,
            maxAge: 7200000,
            path: '/'
          });

        return res.send({success: true});
    }

    @Post('sign-out')
    async signOut(@Response() res) {
        res.cookie('token', null, {
            expires: new Date(),
            httpOnly: true,
            secure: false,
            maxAge: 0,
            path: '/'
          });

        return res.send({success: true});
    }
}
