import { Body, Controller, Get, Post } from '@nestjs/common';
import { NewUserParamsDto } from 'src/users/dtos/newUserParamsDto.dto';
import { UserParamsParsingPipe } from 'src/users/pipes/users/users.pipe';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get()
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Post()
    create(@Body(UserParamsParsingPipe) params: NewUserParamsDto) {
        this.userService.createUser(params)
    }
}
