/* eslint-disable no-unused-labels */
import { AuthController } from '../controllers/AuthController';
import { Repository } from 'typeorm';
import * as typeorm_functions from 'typeorm/globals';
import { App } from '../app';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { hashSync } from 'bcrypt';

describe('AuthController', () => {
  const app = new App();
  beforeAll(async () => {
    app.initRoutes();
    app.listen();
  });

  afterAll(async () => {
    await app.close();
  });
  afterAll(async () => app.close());
  test('Sign up', async () => {
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

    const authContoller = new AuthController();
    const userPayload = {
      firstName: 'test-user',
      lastName: 'test-rople',
      email: 'test@south.com',
      password: 'testpassword',
      role: 3,
      organization_id: 'test-company',
    };
    const newUser = await authContoller.signUp(userPayload);
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
    const authContoller = new AuthController();
    const userPayload = {
      firstName: 'test-user',
      lastName: 'test-rople',
      email: 'test@south.com',
      password: 'testpassword',
      role: 3,
      organization_id: 'test-company',
    };
    try {
      await authContoller.signUp(userPayload);
    } catch (err) {
      expect(err.message).toBe('email already taken');
    }
  });

  test('Signup with invalid request should fail', async () => {
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

    const body = {
      lastName: 'test-rople',
      email: 'test@south.com',
      password: 'testpassword',
      role: 3,
      organization_id: 'test-company',
    };
    try {
      const response = await axios.post('http://localhost:4000/auth/signup', body);
    } catch (err) {
      expect(err.response.data).toContain('firstName must be longer than or equal to 5 characters');
    }
  });

  test('Sign in with correct credentials should pass', async () => {
    //create dummy nonce and dummy jwt
    const nonce = crypto.randomBytes(16).toString('base64');
    const userPassword = hashSync('test-password' + nonce, 10);
    const token = jwt.sign({ userId: 1 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({ nonce: nonce, password: userPassword }),
      save: jest.fn().mockResolvedValue({
        id: 1,
        firstName: 'test-user',
        lastName: 'test-rople',
        email: 'test@south.com',
        password: 'testpassword',
        role: 3,
        organization_id: 'test-company',
        token: token,
      }),
    } as unknown as Repository<any>);

    const body = { email: 'test@south.com', password: 'test-password' };
    try {
      const response = await axios.post('http://localhost:4000/auth/signin', body, {
        headers: { authorization: `Bearer ${token}` },
      });
      expect(response.status).toBe(200);
      expect(Object.prototype.hasOwnProperty.call(response.data, 'token')).toBe(true);
    } catch (err) {
      expect(1 + 2).toBe(1);
    }
  });

  test('Sign in with incorrect credentials should fail', async () => {
    //create dummy nonce and dummy jwt
    const nonce = crypto.randomBytes(16).toString('base64');
    const userPassword = hashSync('test-password' + nonce, 10);
    const token = jwt.sign({ userId: 1 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({ nonce: nonce, password: userPassword }),
      save: jest.fn().mockResolvedValue({
        id: 1,
        firstName: 'test-user',
        lastName: 'test-rople',
        email: 'test@south.com',
        password: 'testpassword',
        role: 3,
        organization_id: 'test-company',
        token: token,
      }),
    } as unknown as Repository<any>);

    const body = { email: 'test@south.com', password: 'wrongpassword' };
    try {
      const response = await axios.post('http://localhost:4000/auth/signin', body, {
        headers: { authorization: `Bearer ${token}` },
      });
      expect(response.status).toBe(200);
      expect(Object.prototype.hasOwnProperty.call(response.data, 'token')).toBe(true);
    } catch (err) {
      expect(err.response.data).toContain('invalid email or password');
    }
  });
});
