import { Repository } from 'typeorm';
import * as typeorm_functions from 'typeorm/globals';
import { UsersService } from '../services/UsersService';
import * as jwt from 'jsonwebtoken';

describe('UsersService', () => {
  //expires in 30 seconds;
  const expiredToken = jwt.sign({ userId: 1 }, 'secret', { expiresIn: '30' });
  test('Should not update user for non-existing user', async () => {
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue({
        firstName: 'test-user',
        lastName: 'test-rople',
        email: 'test@south.com',
        password: 'testpassword',
        role: 3,
        organization_id: 'test-company',
      }),
    } as unknown as Repository<any>);

    const usersService = new UsersService();
    const userPayload = {
      firstName: 'test-user',
      lastName: 'test-rople',
      email: 'test@south.com',
      password: 'testpassword',
      role: 3,
      organization_id: 'test-company',
    };
    try {
      expect(await usersService.updateUser(1, userPayload)).toThrow('user not found');
    } catch (err) {
      console.log('err', err);
      expect(err.message).toBe('user not found');
    }
  });

  test('Should update userr', async () => {
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test-user',
        lastName: 'test-name',
        role: 3,
      }),
      save: jest.fn().mockResolvedValue({
        firstName: 'test-user',
        lastName: 'test-name',
        role: 3,
      }),
    } as unknown as Repository<any>);

    const usersService = new UsersService();
    const userPayload = {
      firstName: 'test-user',
      lastName: 'test-rople',
      role: 3,
    };

    const updatedUser = await usersService.updateUser(1, userPayload);
    console.log('updatedUser', updatedUser);
    expect(updatedUser).toEqual({ firstName: 'test-user', lastName: 'test-name', role: 3 });
  });

  test('Should delete userr', async () => {
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      delete: jest.fn().mockResolvedValue({
        raw: [],
        affected: 1,
      }),
    } as unknown as Repository<any>);

    const usersService = new UsersService();
    const userPayload = {
      firstName: 'test-user',
      lastName: 'test-rople',
      role: 3,
    };

    const deletionResult = await usersService.deleteUser(1);
    console.log('updatedUser', deletionResult);
    expect(deletionResult).toEqual({ raw: [], affected: 1 });
  });
});
