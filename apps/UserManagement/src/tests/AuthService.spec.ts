import { Repository } from 'typeorm';
import * as typeorm_functions from 'typeorm/globals';
import { AuthService } from '../services/AuthService';
import * as jwt from 'jsonwebtoken';

describe('AuthService', () => {
  //expires in 30 seconds;
  const expiredToken = jwt.sign({ userId: 1 }, 'secret', { expiresIn: '30' });
  test('Register User', async () => {
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

    const authService = new AuthService();
    const userPayload = {
      firstName: 'test-user',
      lastName: 'test-rople',
      email: 'test@south.com',
      password: 'testpassword',
      role: 3,
      organization_id: 'test-company',
    };
    const newUser = await authService.registerUser(userPayload);
    expect(newUser.status).toBe(200);
    expect(newUser.user.email).toBe('test@south.com');
    expect(newUser.user.firstName).toBe('test-user');
    expect(newUser.user.lastName).toBe('test-rople');
    expect(newUser.user.organization_id).toBe('test-company');
    expect(newUser.user.role).toBe(3);
    expect(Object.hasOwnProperty.call(newUser.user, 'token')).toBe(true);
  });

  test('Sign up fail with already registered Email', async () => {
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue('test@south.com'),
      save: jest.fn().mockResolvedValue({
        firstName: 'test-user',
        lastName: 'test-rople',
        email: 'test@south.com',
        password: 'testpassword',
        role: 3,
        organization_id: 'test-company',
      }),
    } as unknown as Repository<any>);
    const authService = new AuthService();
    const userPayload = {
      firstName: 'test-user',
      lastName: 'test-rople',
      email: 'test@south.com',
      password: 'testpassword',
      role: 3,
      organization_id: 'test-company',
    };
    try {
      await authService.registerUser(userPayload);
    } catch (err) {
      expect(err.message).toBe('email already taken');
    }
  });

  test('Authorize User', async () => {
    const token = jwt.sign({ userId: 1 }, 'secret', { expiresIn: '24h' });
    const testUser = { id: 1, firstName: 'test', email: 'test@test.com', role: 1, token: token };
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue(testUser),
      save: jest.fn().mockResolvedValue({
        firstName: 'test-user',
        lastName: 'test-rople',
        email: 'test@south.com',
        password: 'testpassword',
        role: 3,
        organization_id: 'test-company',
      }),
    } as unknown as Repository<any>);

    const authService = new AuthService();

    const newUser: any = await authService.authorizeUser(`Bearer ${token}`);
    expect(newUser.Id).toBe(testUser.id);
    expect(newUser.firstName).toBe(testUser.firstName);
    expect(newUser.email).toBe(testUser.email);
    expect(newUser.role).toBe(testUser.role);
  });

  test('Authorization with expired token should fail', async () => {
    const testUser = { id: 1, firstName: 'test', email: 'test@test.com', role: 1, token: expiredToken };
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue(testUser),
      save: jest.fn().mockResolvedValue({
        firstName: 'test-user',
        lastName: 'test-rople',
        email: 'test@south.com',
        password: 'testpassword',
        role: 3,
        organization_id: 'test-company',
      }),
    } as unknown as Repository<any>);

    const authService = new AuthService();
    const authServiceSpy = jest.spyOn(authService, 'authorizeUser');
    try {
      const newUser: any = await authService.authorizeUser(`Bearer ${expiredToken}`);
    } catch (err) {
      expect(err.message).toBe('jwt expired');
    }
  });
});
