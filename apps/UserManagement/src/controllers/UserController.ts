import { ICurrentUser, IUserCreate, Role as UserRole } from '../types/Users';
import { JsonController, Param, Body, Get, Post, Put, Delete, CurrentUser } from 'routing-controllers';
import { UserUpdate, User } from '../validations/Users';
import { UsersService } from '../services/UsersService';
import { ServiceError } from '../common/errors';

@JsonController()
export class UserController {
  private users: UsersService;

  constructor() {
    this.users = new UsersService();
  }
  @Get('/users')
  getAll(@CurrentUser() user: ICurrentUser): Promise<any> {
    if (user.role !== UserRole.full) {
      throw new ServiceError('NOT_AUTHORIZED');
    }
    return this.users.getUsers();
  }

  @Get('/users/:id')
  getUser(@CurrentUser() user: ICurrentUser, @Param('id') id: number): Promise<any> {
    if (user.role !== UserRole.full) {
      throw new ServiceError('NOT_AUTHORIZED');
    }
    return this.users.getUser(id);
  }

  @Post('/users')
  post(@CurrentUser() currentUser: ICurrentUser, @Body() user: User): Promise<any> {
    if (currentUser.role !== UserRole.full) {
      throw new ServiceError('NOT_AUTHORIZED');
    }
    return this.users.createUser(user);
  }
  @Put('/users/:id')
  updateUser(
    @CurrentUser() user: ICurrentUser,
    @Param('id') id: number,
    @Body() updateBody: UserUpdate,
  ): Promise<number> {
    if (user.role !== UserRole.full) {
      throw new ServiceError('NOT_AUTHORIZED');
    }
    return this.users.updateUser(id, updateBody);
  }
  @Delete('/users/:id')
  deleteUser(@CurrentUser() user: ICurrentUser, @Param('id') id: number): Promise<any> {
    if (user.role !== UserRole.full) {
      throw new ServiceError('NOT_AUTHORIZED');
    }
    return this.users.deleteUser(id);
  }
}
