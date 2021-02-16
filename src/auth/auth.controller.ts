import { Body, Controller, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { SignInDto, AuthDto, UpdateUserDto } from './dto/auth-credentials.dto';
import { User } from './user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) signUpDto: AuthDto): Promise<void> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  async signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<{ accessToken: string }> {
    return await this.authService.signIn(signInDto);
  }

  @Patch('')
  @UseGuards(AuthGuard())
  async update(@GetUser('id') userId: number, @Body('nickname') updateNickname: string): Promise<User> {
    return await this.authService.update(userId, updateNickname);
  }
}
