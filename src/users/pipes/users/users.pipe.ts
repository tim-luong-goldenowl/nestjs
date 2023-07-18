import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { NewUserParamsDto } from 'src/users/dtos/newUserParamsDto.dto';

@Injectable()
export class UserParamsParsingPipe implements PipeTransform {
  transform(value: NewUserParamsDto, metadata: ArgumentMetadata) {
    const parseAgeToNumber = parseInt(value.age.toString());

    if(isNaN(parseAgeToNumber))
      throw new HttpException('Invalid Age, expected a number!', HttpStatus.BAD_REQUEST)
    return {...value, age: parseAgeToNumber}
  }
}
