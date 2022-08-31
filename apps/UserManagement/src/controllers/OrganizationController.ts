import { JsonController, Param, Body, Get, Post, Put, Delete, CurrentUser } from 'routing-controllers';
import { OrganizationService } from '../services/OrganizationService';
import { Organization } from '../validations/Organization';
import { ICurrentUser, Role as UserRole } from '../types/Users';
import { ServiceError } from '../common/errors';
@JsonController()
export class OrganizationController {
  @Get('/organizations')
  async getOrganizations(@CurrentUser() user: ICurrentUser): Promise<any> {
    if (user.role !== UserRole.full) {
      throw new ServiceError('NOT_AUTHORIZED');
    }

    return new OrganizationService().getOrganizations();
  }

  @Post('/organizations')
  async createOrganization(@CurrentUser() user: ICurrentUser, @Body() body: Organization): Promise<any> {
    if (user.role !== UserRole.full) {
      throw new ServiceError('NOT_AUTHORIZED');
    }
    return new OrganizationService().creatOrganization(body);
  }

  @Delete('/organizations/:organization_id')
  deleteOrganization(
    @CurrentUser() user: ICurrentUser,
    @Param('organization_id') organization_id: string,
  ): Promise<any> {
    if (user.role !== UserRole.full) {
      throw new ServiceError('NOT_AUTHORIZED');
    }
    return new OrganizationService().deletOrganization(organization_id);
  }

  @Put('/organizations/:organization_id')
  updateOrganization(
    @CurrentUser() user: ICurrentUser,
    @Param('organization_id') organization_id: string,
    @Body() updateRole_body: { role_name },
  ): Promise<any> {
    if (user.role !== UserRole.full) {
      throw new ServiceError('NOT_AUTHORIZED');
    }
    return new OrganizationService().updateOrganization(organization_id, updateRole_body);
  }
}
