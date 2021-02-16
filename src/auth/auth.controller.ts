import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
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
  @ApiBody({ description: '회원가입 API', type: AuthDto })
  async signUp(@Body(ValidationPipe) signUpDto: AuthDto): Promise<UserResponseMessage> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  @ApiBody({ description: '로그인 API', type: SignInDto })
  async signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<{ accessToken: string }> {
    return await this.authService.signIn(signInDto);
  }

  @ApiBearerAuth()
  @Patch('/nickname')
  @UseGuards(AuthGuard())
  @ApiBody({ description: '닉네임 변경 API' })
  async updateNickname(@GetUser() updateUser: User, @Body('nickname') updateNickname: string): Promise<User> {
    return await this.authService.updateNickname(updateUser, updateNickname);
  }

  @ApiBearerAuth()
  @Patch('/password')
  @UseGuards(AuthGuard())
  @ApiBody({ description: '패스워드 변경 API', type: UpdatePasswordDto })
  async updatePassoword(
    @GetUser() updateUser: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseMessage> {
    return this.authService.updatePassword(updateUser, updatePasswordDto);
  }

  @ApiBearerAuth()
  @Delete('/user')
  @UseGuards(AuthGuard())
  @ApiBody({ description: '회원 탈퇴 API' })
  async deleteUser(@GetUser() deleteUser: User): Promise<UserResponseMessage> {
    return this.authService.deleteUser(deleteUser);
  }

  @ApiBearerAuth()
  @Get('/user')
  @UseGuards(AuthGuard())
  @ApiBody({ description: '내 정보 조회 API' })
  async findMe(@GetUser() me: User): Promise<User> {
    return await this.authService.findMe(me);
  }

  @Get('/user/:id')
  @ApiBody({ description: '유저 조회 API' })
  async findUser(@Param('id') id: string) {
    return await this.authService.findUser(id);
  }
}
