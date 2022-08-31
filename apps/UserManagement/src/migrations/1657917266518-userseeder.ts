import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { UserSeed } from '../seeds/Users';
import { Organisations } from '@src/entity/Organizations';
import { hashSync } from 'bcrypt';

export class userseeder1657917266518 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.commitTransaction();
    const organizations = await getRepository(Organisations).find({});
    const gamioticsOrganizationId = organizations.find((org) => org.organization_name == 'Gamiotics');
    const southRiverOrganizationId = organizations.find((org) => org.organization_name == 'SouthRiver');

    console.log('gamioticsOrganizationId', gamioticsOrganizationId);
    console.log('southRiverOrganizationId', southRiverOrganizationId);
    if (gamioticsOrganizationId) {
      UserSeed[0].organization_id = gamioticsOrganizationId.organization_id;
    }
    if (southRiverOrganizationId) {
      UserSeed[1].organization_id = southRiverOrganizationId.organization_id;
      UserSeed[2].organization_id = southRiverOrganizationId.organization_id;
    }
    console.log('userSeeds', UserSeed);
    await getRepository('Users').save(UserSeed);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
