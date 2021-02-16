import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class AuthDto extends SignInDto {
  @IsString()
  @ApiProperty()
  nickname: string;
}

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  update: string;
}
