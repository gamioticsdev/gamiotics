import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Roles')
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100 })
  role_id: string;
  @Column({ length: 100 })
  role_name: string;
}
