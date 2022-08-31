import { hashSync } from 'bcrypt';
export const UserSeed = [
  {
    firstName: 'Jim',
    lastName: 'Jimmy',
    email: 'jimy@gamiotics.com',
    password: hashSync('123456gamiotics', 10),
    organization_id: '',
    token: '',
    role: 1,
  },
  {
    firstName: 'Edward',
    lastName: 'Ropple',
    email: 'Edward@gamiotics.com',
    password: hashSync('123456gamiotics', 10),
    organization_id: '',
    token: '',
    role: 2,
  },
  {
    firstName: 'Edward',
    lastName: 'HollComb',
    email: 'holcomb@gamiotics.com',
    password: hashSync('12356gamiotics', 10),
    organization_id: '',
    token: '',
    role: 3,
  },
];
