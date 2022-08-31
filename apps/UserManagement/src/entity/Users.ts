import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from './Roles';

enum RoleEnum {
  admin,
  moderator,
  user,
}
@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100 })
  firstName: string;
  @Column({ length: 100 })
  lastName: string;
  @Column()
  email: string;
  @Column()
  organization_id: string;
  @Column({ nullable: false })
  password: string;
  @Column({ nullable: true })
  token: string;
  @Column({ nullable: false })
  role: number;
  @Column({ nullable: true })
  nonce: string;
}
