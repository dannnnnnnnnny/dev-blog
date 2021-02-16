import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { SignInDto, SignUpDto } from '../dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { username, password, nickname } = signUpDto;

    const user = new User();
    user.username = username;
    user.nickname = nickname;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('username already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async signIn(signInDto: SignInDto) {
    const { username, password } = signInDto;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }
}
