import { Length } from 'class-validator';
export class Organization {
  @Length(5, 30)
  organization_name: string;
}
