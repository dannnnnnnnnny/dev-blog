import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  nickname: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  salt: string;

  async validatePassword(password): Promise<boolean> {
    return this.password === (await bcrypt.hash(password, this.salt));
  }
}
