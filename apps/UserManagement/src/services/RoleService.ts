import { getRepository, Repository } from 'typeorm';
import { Role } from '../validations/Roles';
import { Roles } from '../entity/Roles';
import { v4 as uuidv4 } from 'uuid';
import { ServiceError } from '../common/errors';

export class RoleService {
  private rolesRepository: Repository<Roles>;
  constructor() {
    this.rolesRepository = getRepository(Roles);
  }

  public async getRoles(): Promise<{ status: number; roles: Roles[] }> {
    const roles = await this.rolesRepository.find();
    return { status: 200, roles: roles };
  }

  public async createRole(rolePayLoad: Role): Promise<{ status: number; role: Roles }> {
    const newRole = new Roles();
    newRole.role_name = rolePayLoad.role_name;
    newRole.role_id = uuidv4();
    const role = await this.rolesRepository.save(newRole);
    return { status: 200, role };
  }

  public async deletRole(roleId: string): Promise<any> {
    //we may want to soft delete the resource,
    return this.rolesRepository.delete({ role_id: roleId });
  }

  public async updateRole(roleId: string, roleUpdate_body:Role): Promise<any> {
    const existingRole = await this.rolesRepository.findOne({role_name: roleId});
    if(!existingRole) {
      throw new ServiceError('NOT_FOUND');
    }
    return this.rolesRepository.update(
      { role_id: roleId },
      {
        ...roleUpdate_body,
      },
    );
  }
}
