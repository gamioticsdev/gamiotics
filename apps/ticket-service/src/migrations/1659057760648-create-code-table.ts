import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createCodeTable1659057760648 implements MigrationInterface {
  private codeTable = new Table({
    name: 'codes',
    columns: [
      {
        name: 'code',
        type: 'varchar',
        isPrimary: true,
        length: '100',
        isNullable: false,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      },
      {
        name: 'performance_id',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'rotates',
        type: 'boolean',
        default: true,
      },
      {
        name: 'rotation_frequency',
        type: 'smallint',
        isNullable: false,
      },
      {
        name: 'created_at',
        type: 'timestamp',
        isNullable: false,
      },
    ],
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.codeTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.codeTable);
  }
}
