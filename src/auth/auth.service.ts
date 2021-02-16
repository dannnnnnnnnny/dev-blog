import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto, AuthDto, UpdatePasswordDto } from './dto/auth-credentials.dto';
import { UserResponseMessage } from './dto/user-res-message.dto';
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

  async signUp(signUpDto: AuthDto): Promise<UserResponseMessage> {
    return await this.userRepository.signUp(signUpDto);
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const username = await this.userRepository.signIn(signInDto);

    if (!username) {
      throw new UnauthorizedException('user does not exist.');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  async updateNickname(updateUser: User, updateNickname: string): Promise<User> {
    const user = await this.userRepository.findOne({ id: updateUser.id });
    delete user.password;
    delete user.salt;

    user.nickname = updateNickname;

    return await this.userRepository.save(user);
  }

  async updatePassword(updateUser: User, updatePasswordDto: UpdatePasswordDto): Promise<UserResponseMessage> {
    return await this.userRepository.updatePassword(updateUser, updatePasswordDto);
  }

  async deleteUser(deleteUser: User): Promise<UserResponseMessage> {
    await this.userRepository.delete({ id: deleteUser.id });

    const message: UserResponseMessage = {
      message: 'user has been deleted successfully.',
    };

    return message;
  }

  async findMe(user: User): Promise<User> {
    const me = await this.userRepository.findOne({ id: user.id });
    delete me.password;
    delete me.salt;

    return me;
  }

  async findUser(id: string): Promise<User | UserResponseMessage> {
    try {
      const user = await this.userRepository.findOne(id);
      delete user.password;
      delete user.salt;

      return user;
    } catch (error) {
      const message: UserResponseMessage = {
        message: 'user does not exist.',
      };

      return message;
    }
  }
}
