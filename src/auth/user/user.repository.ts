import { BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { SignInDto, AuthDto, UpdatePasswordDto } from '../dto/auth-credentials.dto';
import { UserResponseMessage } from '../dto/user-res-message.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async signUp(signUpDto: AuthDto): Promise<UserResponseMessage> {
    const { username, password, nickname } = signUpDto;

    const user = new User();
    user.username = username;
    user.nickname = nickname;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
      const message: UserResponseMessage = {
        message: 'signup has been successful.',
      };
      return message;
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('username already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async signIn(signInDto: SignInDto): Promise<string> {
    const { username, password } = signInDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  async updatePassword(updateUser: User, updatePasswordDto: UpdatePasswordDto): Promise<UserResponseMessage> {
    const { password, update } = updatePasswordDto;

    const user = await this.findOne({ id: updateUser.id });
    if (await user.validatePassword(password)) {
      user.password = await this.hashPassword(update, user.salt);
      await user.save();
      const message: UserResponseMessage = {
        message: 'Password change successful',
      };
      return message;
    } else {
      throw new BadRequestException('Passwords do not match.');
    }
  }
}
