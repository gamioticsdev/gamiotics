import { Length } from 'class-validator';
export class Role {
  @Length(5, 30)
  role_name: string;
}
