import { ApiProperty } from '@nestjs/swagger';

export class userDTO {
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;
}
