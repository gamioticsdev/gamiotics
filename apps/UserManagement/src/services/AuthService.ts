import * as jwt from 'jsonwebtoken';
import { UsersService } from '../services/UsersService';
import { ICurrentUser, UserDTO } from '../types/Users';
import { Users } from '../entity/Users';
import { compareSync } from 'bcrypt';
import { ServiceError } from '../common/errors';
import { User } from '../validations/Users';

export class AuthService {
  private users: UsersService;
  constructor() {
    this.users = new UsersService();
  }
  public async registerUser(userPayLoad: User): Promise<{ status: number; user: UserDTO }> {
    //find if email is already taken
    const existingUser = await this.users.getUserByEmail(userPayLoad.email);

    if (existingUser) {
      throw new Error('email already taken');
    }

    let user = await this.users.createUser(userPayLoad);
    const secret = 'secrete';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
    user.token = token;
    user = await this.users.saveUserToken(token, user.id);
    return { status: 200, user: this.toDTO(user) };
  }

  public async signIn(creds: any): Promise<UserDTO> {
    const existingUser = await this.users.getUserByEmail(creds.email);
    if (!existingUser) {
      throw new Error('user does not exist with this email');
    }

    const checkPassword = compareSync(creds.password + existingUser.nonce, existingUser.password);
    if (!checkPassword) {
      throw new Error('invalid email or password');
    }
    const token = jwt.sign({ userId: existingUser.id }, 'secret', { expiresIn: '24h' });
    existingUser.token = token;
    await this.users.saveUserToken(token, existingUser.id);
    return this.toDTO(existingUser);
  }

  public async authorizeUser(token: string): Promise<ICurrentUser | ServiceError> {
    if (!token) {
      // throw new Error(new ServiceError('TOKEN_NOT_PROVIDED').error.message);
      throw new Error('TOKEN_NOT_PROVIDED');
    }

    const user = await this.users.getUserByToken(token.split(' ')[1]);
    if (!user) {
      console.log('throwing not authorize user not found');
      throw new Error('TOKEN_NOT_PROVIDED');
    }
    const decoded = jwt.verify(user.token, 'secret');
    console.log('decoded', decoded);

    return {
      Id: user.id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
    };
  }

  private toDTO(User: Users): UserDTO {
    const userDto: Partial<UserDTO> = {};
    userDto.email = User.email;
    userDto.firstName = User.firstName;
    userDto.lastName = User.lastName;
    userDto.organization_id = User.organization_id;
    userDto.role = User.role;
    userDto.token = User.token;
    return <UserDTO>userDto;
  }
}
