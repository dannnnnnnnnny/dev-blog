import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto, AuthDto, UpdatePasswordDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { User } from './user/user.entity';
import { UserRepository } from './user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: AuthDto): Promise<void> {
    return await this.userRepository.signUp(signUpDto);
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const username = await this.userRepository.signIn(signInDto);

    if (!username) {
      throw new UnauthorizedException('Unauthorized');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  async updateNickname(updateUser: User, updateNickname: string): Promise<User> {
    const user = await this.userRepository.findOne({ id: updateUser.id });
    delete user.password;
    user.nickname = updateNickname;

    return await this.userRepository.save(user);
  }

  async updatePassword(updateUser: User, updatePasswordDto: UpdatePasswordDto): Promise<void> {
    return await this.userRepository.updatePassword(updateUser, updatePasswordDto);
  }
}
