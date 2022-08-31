import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('codes')
export class Code {
  @PrimaryGeneratedColumn('uuid')
  code: string;
  @Column({ type: 'uuid' })
  performance_id: string;

  @Column({ type: 'boolean', default: true })
  rotates: boolean;

  @Column({ type: 'smallint' })
  rotation_frequency: number;

  @Column({ type: 'timestamp' })
  created_at: Date;
}
