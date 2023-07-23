import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserSigninParamsDto } from './dtos/user-signin-params.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { iTokens } from './interfaces/tokens.interface';
import { iUserJwtPayload } from './interfaces/user-jwt-payload.interfact';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async validateUser(params: UserSigninParamsDto): Promise<any> {
        const user = await this.userRepository.findOneBy({ email: params.email });

        if (!user) {
            throw new HttpException('User does not exist!', HttpStatus.BAD_REQUEST)
        }

        const passwordMatchs = await bcrypt.compareSync(params.password, user.password)

        if (user && passwordMatchs) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: User): Promise<string> {
        const payload: iUserJwtPayload = {
            id: user.id
        } 
        
        const accessToken = await this.jwtService.signAsync(payload)

        return accessToken;
    }
}
