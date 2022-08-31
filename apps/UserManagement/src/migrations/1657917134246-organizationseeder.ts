import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { seedOrganizations } from '../seeds/Organizations';
import { Organisations } from '../entity/Organizations';


export class organizationseeder1657917134246 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await getRepository(Organisations).save(seedOrganizations);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
