import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DonationReceiversModule } from './donation-receivers/donation-receivers.module';
import { StripeUltilsModule } from './stripe/stripe.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import User from './users/entities/user.entity';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { UrlGeneratorModule } from 'nestjs-url-generator';
import { urlGeneratorModuleConfig } from './configs/signed-url.config';
import { UsersMiddleware } from './users/middlewares/users/users.middleware';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    UsersModule,
    DonationReceiversModule,
    StripeUltilsModule,
    NestjsFormDataModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UrlGeneratorModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => urlGeneratorModuleConfig(configService),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      UsersMiddleware
    ).forRoutes('users')
  }
}