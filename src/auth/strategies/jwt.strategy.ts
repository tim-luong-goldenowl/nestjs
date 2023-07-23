import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { iUserJwtPayload } from '../interfaces/user-jwt-payload.interfact';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('AT_SECRECT'),
    });
  }

  async validate(payload: iUserJwtPayload) {
    const user = await this.userService.findOneById(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}