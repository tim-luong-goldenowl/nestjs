import { Injectable } from '@nestjs/common';
import { iUser } from 'src/users/interfaces/iUser.interface';

@Injectable()
export class UsersService {
    userList: Array<iUser> = []

    getAllUsers() {
        return this.userList;
    }

    createUser(userParams: iUser) {
        this.userList.push(userParams)
    }
}
