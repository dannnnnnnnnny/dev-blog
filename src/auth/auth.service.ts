import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto, SignUpDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    return this.userRepository.signUp(signUpDto);
  }

  async signIn(signInDto: SignInDto) {
    return this.userRepository.signIn(signInDto);
  }
}
