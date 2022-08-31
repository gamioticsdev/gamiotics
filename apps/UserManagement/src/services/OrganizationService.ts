import { getRepository, Repository } from 'typeorm';
import { Organization } from '../validations/Organization';
import { Organisations } from '../entity/Organizations';

export class OrganizationService {
  private organizationRepository: Repository<Organisations>;
  constructor() {
    this.organizationRepository = getRepository(Organisations);
  }

  public async getOrganizations(): Promise<Organisations[]> {
    return this.organizationRepository.find({});
  }

  public async creatOrganization(
    organizationPayload: Organization,
  ): Promise<{ status: number; organization: Organisations }> {
    const newOrganization = new Organisations();
    newOrganization.organization_name = organizationPayload.organization_name;
    const organization = await this.organizationRepository.save(newOrganization);
    return { status: 200, organization };
  }

  public async deletOrganization(organizationId: string): Promise<any> {
    //we may want to soft delete the resource,
    return this.organizationRepository.delete({ organization_id: organizationId });
  }

  public async updateOrganization(organizationId: string, organizationUpdate_body): Promise<any> {
    return this.organizationRepository.update(
      { organization_id: organizationId },
      {
        ...organizationUpdate_body,
      },
    );
  }
}
