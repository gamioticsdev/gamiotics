import { JsonController, Param, Body, Get, Post, Put, Delete, CurrentUser } from 'routing-controllers';
import { RoleService } from '../services/RoleService';
import { Role } from '../validations/Roles';
import { ICurrentUser, Role as UserRole } from '../types/Users';
import { ServiceError } from '../common/errors';
@JsonController()
export class RolesController {
  @Get('/roles')
  async getRoles(@CurrentUser() user: ICurrentUser): Promise<any> {
    if (user.role !== UserRole.full) {
      throw new ServiceError('NOT_AUTHORIZED');
    }
    return new RoleService().getRoles();
  }
  @Post('/roles')
  async createRole(@CurrentUser() user: ICurrentUser, @Body() body: Role): Promise<any> {
    if (user.role !== UserRole.full) {
      throw new ServiceError('NOT_AUTHORIZED');
    }
    return new RoleService().createRole(body);
  }

  @Delete('/roles/:role_id')
  deleteRole(@CurrentUser() user: ICurrentUser, @Param('role_id') role_id: string): Promise<any> {
    if (user.role !== UserRole.full) {
      throw new ServiceError('NOT_AUTHORIZED');
    }
    return new RoleService().deletRole(role_id);
  }

  @Put('/roles/:role_id')
  updateRole(
    @CurrentUser() user: ICurrentUser,
    @Param('role_id') role_id: string,
    @Body() updateRole_body: Role,
  ): Promise<any> {
    if (user.role !== UserRole.full) {
      throw new ServiceError('NOT_AUTHORIZED');
    }
    return new RoleService().updateRole(role_id, updateRole_body);
  }
}
