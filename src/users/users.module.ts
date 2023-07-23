import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './controllers/users/user.controller';
import { UsersMiddleware } from './middlewares/users/users.middleware';
import { UsersService } from './services/users/users.service';
import User from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User])]
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      UsersMiddleware
    ).forRoutes('users')
  }
}