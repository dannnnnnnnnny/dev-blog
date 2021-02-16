import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from '../dto/signup.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { username, password } = signUpDto;

    // const exists = await this.findOne({ username });
    // if (exists) {
    //   throw new ConflictException('already exists');
    // }

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = password;

    try {
      await user.save();
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('username already exists');
      }
      throw new InternalServerErrorException();
    }
  }
}
