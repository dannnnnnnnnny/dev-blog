import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class AuthDto extends SignInDto {
  @IsString()
  nickname: string;
}

export class UpdatePasswordDto {
  @IsString()
  password: string;

  @IsString()
  update: string;
}
