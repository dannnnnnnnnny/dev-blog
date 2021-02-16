import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class SignUpDto extends SignInDto {
  @IsString()
  nickname: string;
}
