import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { SignInDto, AuthDto, UpdatePasswordDto } from './dto/auth-credentials.dto';
import { UserResponseMessage } from './dto/user-res-message.dto';
import { User } from './user/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) signUpDto: AuthDto): Promise<UserResponseMessage> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  async signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<{ accessToken: string }> {
    return await this.authService.signIn(signInDto);
  }

  @ApiBearerAuth()
  @Patch('/nickname')
  @UseGuards(AuthGuard())
  async updateNickname(@GetUser() updateUser: User, @Body('nickname') updateNickname: string): Promise<User> {
    return await this.authService.updateNickname(updateUser, updateNickname);
  }

  @ApiBearerAuth()
  @Patch('/password')
  @UseGuards(AuthGuard())
  async updatePassoword(
    @GetUser() updateUser: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseMessage> {
    return this.authService.updatePassword(updateUser, updatePasswordDto);
  }

  @ApiBearerAuth()
  @Delete('/user')
  @UseGuards(AuthGuard())
  async deleteUser(@GetUser() deleteUser: User): Promise<UserResponseMessage> {
    return this.authService.deleteUser(deleteUser);
  }

  @ApiBearerAuth()
  @Get('/user')
  @UseGuards(AuthGuard())
  async findMe(@GetUser() me: User): Promise<User> {
    return await this.authService.findMe(me);
  }

  @Get('/user/:id')
  async findUser(@Param('id') id: string) {
    return await this.authService.findUser(id);
  }
}
