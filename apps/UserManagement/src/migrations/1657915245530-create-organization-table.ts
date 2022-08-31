import { query } from 'express';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createOrganisationTable1657915245530 implements MigrationInterface {
  private organizationsTable = new Table({
    name: 'Organisations',
    columns: [
      {
        name: 'organization_id',
        type: 'varchar',
        isPrimary: true,
        length: '100',
        isNullable: false,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      },
      {
        name: 'organization_name',
        type: 'varchar',
        length: '100',
        isNullable: false,
      },
    ],
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.organizationsTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.organizationsTable);
  }
}
