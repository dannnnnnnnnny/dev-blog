import { Body, Controller, Delete, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { SignInDto, AuthDto, UpdatePasswordDto } from './dto/auth-credentials.dto';
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

  @Patch('nickname')
  @UseGuards(AuthGuard())
  async updateNickname(@GetUser() updateUser: User, @Body('nickname') updateNickname: string): Promise<User> {
    return await this.authService.updateNickname(updateUser, updateNickname);
  }

  @Patch('password')
  @UseGuards(AuthGuard())
  async updatePassoword(@GetUser() updateUser: User, @Body() updatePasswordDto: UpdatePasswordDto): Promise<void> {
    return this.authService.updatePassword(updateUser, updatePasswordDto);
  }

  @Delete('')
  @UseGuards(AuthGuard())
  async deleteUser(@GetUser() deleteUser: User): Promise<void> {
    return this.authService.deleteUser(deleteUser);
  }
}
