import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
}
