import { UserDocument } from '../schemas/user.schema';
import { userDTO } from '../dto/user.dto';
import { User } from '../schemas/user.schema';
import { UserResponseDto } from '../dto/userResponse.dto';

export class UserMapper {
  static convertDTOToUser(userDTO: userDTO): User {
    const userConvert = new User();
    userConvert.name = userDTO.name;
    userConvert.email = userDTO.email;
    userConvert.password = userDTO.password;
    return userConvert;
  }

  static converUserToDTO(user: UserDocument): userDTO {
    const userConvert = new userDTO();
    userConvert.name = user.name;
    userConvert.email = user.email;
    userConvert.password = user.password;
    return userConvert;
  }

  static convertUserToResponse(userSaved: UserDocument): UserResponseDto {
    const userConvert = new UserResponseDto();

    userConvert.id = userSaved._id.toString();
    userConvert.name = userSaved.name;
    userConvert.email = userSaved.email;
    userConvert.role = userSaved.role;

    return userConvert;
  }
}
