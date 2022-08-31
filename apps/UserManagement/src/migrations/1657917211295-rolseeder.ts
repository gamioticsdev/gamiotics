import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { seedingRoles } from '../seeds/Roles';

export class rolseeder1657917211295 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await getRepository('Roles').save(seedingRoles);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

//