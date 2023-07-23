import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegistrationParamsDto } from 'src/auth/dtos/user-registration-params.dto';
import User from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async createUser(params: UserRegistrationParamsDto): Promise<User> {
        const user = await this.userRepository.create(params);
        this.userRepository.save(user);
        return user
    }

    async findOneById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: id });
        return user;
    }
}
