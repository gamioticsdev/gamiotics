import { MigrationInterface, QueryRunner, getRepository, Table, TableColumn } from 'typeorm';

export class CreateUsers1657915079266 implements MigrationInterface {
  private usersTable = new Table({
    name: 'Users',
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'firstName',
        type: 'varchar',
        length: '50',
        isNullable: false,
      },
      {
        name: 'lastName',
        type: 'varchar',
        length: '50',
        isNullable: false,
      },
      {
        name: 'email',
        type: 'varchar',
        length: '100',
        isUnique: true,
      },
      {
        name: 'password',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'nonce',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'token',
        isNullable: true,
        type: 'varchar',
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.usersTable);
    // await queryRunner.createTable(this.rolesTable);

    await queryRunner.addColumn(
      'Users',
      new TableColumn({
        name: 'role',
        type: 'int',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.usersTable);
  }
}
