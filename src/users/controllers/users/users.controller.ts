import { Body, Controller, Get, Post } from '@nestjs/common';
import { NewUserParamsDto } from 'src/users/dtos/newUserParamsDto.dto';

@Controller('users')
export class UsersController {
    @Get()
    getAllUsers() {
        return [{
            name: 'asdasd',
            age: 123
        }]
    }

    @Post()
    create(@Body() params: NewUserParamsDto) {
        console.log(params);
        return params;
    }
}
