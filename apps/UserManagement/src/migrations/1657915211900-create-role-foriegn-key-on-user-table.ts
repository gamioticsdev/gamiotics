import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class createRoleForiegnKeyOnUser1657915211900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'Users',
      new TableForeignKey({
        columnNames: ['role'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Roles',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
