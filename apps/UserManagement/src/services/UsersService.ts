import { DeleteResult, getRepository, Repository } from 'typeorm';
import { Users } from '../entity/Users';
import { User, UserUpdate } from '../validations/Users';
import { hashPassword, generateNonce } from '../common/utils';

export class UsersService {
  private userRepository: Repository<Users>;
  constructor() {
    this.userRepository = getRepository(Users);
  }
  public async createUser(createInput: User): Promise<any> {
    const nonce = generateNonce();
    const user = new Users();

    user.firstName = createInput.firstName;
    user.email = createInput.email;
    user.lastName = createInput.lastName;
    user.password = hashPassword(createInput.password + nonce);
    user.role = createInput.role;
    user.nonce = nonce;
    user.organization_id = createInput.organization_id;

    const newUser = await this.userRepository.save(user);

    return newUser;
  }
  public async updateUser(userId: number, updateBody: UserUpdate): Promise<any> {
    console.log('updateBody', updateBody);
    const existingUser = await this.userRepository.findOne({ id: userId });

    if (!existingUser) {
      throw new Error('user not found');
    }
    //update fiels in existing user
    if (updateBody.firstName) {
      existingUser.firstName = updateBody.firstName;
    }

    if (updateBody.lastName) {
      existingUser.lastName = updateBody.lastName;
    }

    if (updateBody.role) {
      existingUser.role = updateBody.role;
    }
    return this.userRepository.save(existingUser);
  }

  public async getUser(userId: number): Promise<Users | undefined> {
    return this.userRepository.findOne(userId);
  }

  public async getUserByEmail(email: string): Promise<Users | undefined> {
    return this.userRepository.findOne({ email: email });
  }

  public async deleteUser(userId: number): Promise<DeleteResult> {
    return this.userRepository.delete({ id: userId });
  }

  public async getUsers(): Promise<Users[] | undefined> {
    return this.userRepository.find();
  }

  public async saveUserToken(token: string, userId: number): Promise<any> {
    const user = await this.userRepository.findOne({ id: userId });

    return this.userRepository.save({
      ...user,
      token: token,
    });
  }

  public async getUserByToken(token: string): Promise<Users | undefined> {
    return this.userRepository.findOne({ token: token });
  }
}
