import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get()
    getAllUsers() {
        return [
            123,123,123
        ]
    }

    @Get('/me')
    async me(@Req() req) {
        const user = await this.userService.findOneById(req.user.id);
        return user;
    }
}
