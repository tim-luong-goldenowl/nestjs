import { ConfigService } from '@nestjs/config';
import { UrlGeneratorModuleOptions } from 'nestjs-url-generator';

export function urlGeneratorModuleConfig(configService: ConfigService): UrlGeneratorModuleOptions {
  return {
    secret: configService.get('APP_KEY'),
    appUrl: configService.get('APP_URL')
  };
}