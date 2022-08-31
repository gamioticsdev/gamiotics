import { MigrationInterface, QueryRunner, TableForeignKey, TableColumn } from 'typeorm';

export class createOrganizationForeignkeyOnUserTable1657915282462 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'Users',
      new TableColumn({
        name: 'organization_id',
        type: 'varchar',
      }),
    );

    await queryRunner.createForeignKey(
      'Users',
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedColumnNames: ['organization_id'],
        referencedTableName: 'Organisations',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
