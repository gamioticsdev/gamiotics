import { MigrationInterface, QueryRunner, Table } from 'typeorm';
export class createRoles1657915125500 implements MigrationInterface {
  private rolesTable = new Table({
    name: 'Roles',
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'role_id',
        type: 'varchar',
        length: '100',
        isNullable: false,
      },
      {
        name: 'role_name',
        type: 'varchar',
        length: '100',
        isNullable: false,
        isUnique: true,
      },
    ],
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.rolesTable);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
