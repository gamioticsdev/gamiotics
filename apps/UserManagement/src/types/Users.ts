export interface IUserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: number;
  organization_id: string;
}

export interface ICurrentUser {
  Id: number;
  firstName: string;
  email: string;
  role: Role;
}

export enum Role {
  full = 1,
  editor,
  operator,
}

export interface IUserUpdate {
  firstName?: string;
  lastName?: string;
  role?: number;
}
export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  organization_id: string;
  token: string;
  role: number;
}
