import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { iUserJwtPayload } from '../interfaces/user-jwt-payload.interfact';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/services/users/users.service';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors(
        [
          JwtStrategy.extractJWT,
          ExtractJwt.fromAuthHeaderAsBearerToken()
        ]
      ),
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

  private static extractJWT(@Req() request: RequestType): string | null {
    console.log("!!!!!!!!!!!! extractJWT", request.cookies)
    if (
      request.cookies &&
      'token' in request.cookies &&
      request.cookies.token.length > 0
    ) {
      return request.cookies.token;
    }
    return null;
  }
}