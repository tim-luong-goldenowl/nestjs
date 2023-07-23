import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { UserRegistrationParamsDto } from 'src/auth/dtos/user-registration-params.dto';

@Injectable()
export class UserRegistrationParamsParsingPipe implements PipeTransform {
  transform(value: UserRegistrationParamsDto, metadata: ArgumentMetadata) {

  }
}
