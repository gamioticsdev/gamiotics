import { v4 as uuidv4 } from 'uuid';
export const seedingRoles = [
  {
    role_id: uuidv4(),
    role_name: 'full',
  },
  {
    role_id: uuidv4(),
    role_name: 'editor',
  },
  {
    role_id: uuidv4(),
    role_name: 'operator',
  },
];
