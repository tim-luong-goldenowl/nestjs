import { Body, Controller, Get, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from 'src/users/dtos/user.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService
    ) { }

    @Get('/me')
    async me(@Req() req) {
        const user = await this.userService.findOneById(req.user.id);
        return user;
    }

    @Get('/profiles')
    async profiles(@Req() req) {
        const profiles = await this.userService.getProfiles(req.user.id);

        return profiles
    }

    @Put('/update-profile')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateProfile(@Body() params, @UploadedFile() avatar) {
        console.log("@@@@@@@@@@@@@@@avatar", avatar)
        console.log("@@@@@@@@@@@@@@@params", params)
        const user = await this.userService.updateUser(params);
        return user;
    }
}
