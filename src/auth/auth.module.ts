import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersMiddleware } from 'src/users/middlewares/users/users.middleware';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { S3Service } from 'src/s3/s3.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, S3Service, UsersService, ConfigService, LocalStrategy, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([User, DonationReceiver]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('AT_SECRECT'),
          signOptions: { expiresIn: 3600 * 7 },
        }
      },
    })
  ],
})

export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      UsersMiddleware
    ).forRoutes('auth')
  }
}