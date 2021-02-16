import { ApiProperty } from '@nestjs/swagger';

export class UserResponseMessage {
  @ApiProperty()
  message: string;
}
