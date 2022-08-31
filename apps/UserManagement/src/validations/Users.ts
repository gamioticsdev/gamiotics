import { Length, IsEmail, isInt, Min, Max, IsInt, IsOptional } from 'class-validator';
export class User {
  @Length(5, 30)
  firstName: string;

  @Length(5, 30)
  lastName: string;

  @IsEmail()
  email: string;

  @Length(5, 50)
  password: string;

  @Length(20, 50)
  organization_id: string;

  @IsInt()
  @Min(1)
  @Max(3)
  role: number;
}

export class UserUpdate {
  @IsOptional()
  @Length(5, 30)
  firstName?: string;

  @IsOptional()
  @Length(5, 30)
  lastName?: string;

  @IsInt()
  @Min(1)
  @Max(3)
  @IsOptional()
  role?: number;
}
