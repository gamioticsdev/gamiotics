import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Organisations')
export class Organisations {
  @PrimaryGeneratedColumn('uuid')
  organization_id: string;

  @Column({ length: 100 })
  organization_name: string;
}
