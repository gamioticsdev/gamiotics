/* eslint-disable no-unused-labels */
import { Repository } from 'typeorm';
import * as typeorm_functions from 'typeorm/globals';
import { App } from '../app';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { hashSync } from 'bcrypt';

describe('RolesController', () => {
  const testRoles = [
    {
      role_name: 'test-role',
      role_id: 'test-guid',
    },
    {
      role_name: 'test-organization',
      role_id: 'test-guid',
    },
  ];
  const app = new App();
  beforeAll(async () => {
    app.initRoutes();
    app.listen();
  });

  afterAll(async () => app.close());

  test('Get All Roles Without JWT should be failed', async () => {
    //create dummy nonce and dummy jwt
    const nonce = crypto.randomBytes(16).toString('base64');
    const userPassword = hashSync('test-password' + nonce, 10);
    const token = jwt.sign({ userId: 1, role: 1 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({ nonce: nonce, password: userPassword }),
      find: jest.fn().mockResolvedValueOnce(testRoles),
      save: jest.fn().mockResolvedValue({
        role_id: 'test-guid',
        role_name: 'test-role',
      }),
      delete: jest.fn().mockResolvedValueOnce({
        raw: [],
        affected: 1,
      }),
    } as unknown as Repository<any>);

    try {
      const response = await axios.get('http://localhost:4000/roles', {
        headers: { authorization: `Bearer ${token}` },
      });
      expect(response.status).toBe(200);
      expect(response.data.length).toBe(4);
    } catch (err) {
      expect(err.response.data).toBe('jwt must be provided');
      expect(err.response.status).toBe(400);
    }
  });

  test('Should get all roles for a token of admin role', async () => {
    const token = jwt.sign({ userId: 1, role: 1 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test',
        password: 'testpassword',
        token: token,
        role: 1,
        email: 'test@test.com',
      }),
      find: jest.fn().mockResolvedValueOnce(testRoles),
    } as unknown as Repository<any>);

    const response = await axios.get('http://localhost:4000/roles', {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(response.status).toBe(200);
    expect(response.data.roles).toEqual(testRoles);
    console.log('respdata', response.data);
  });

  test('Should not get all roles for a token of non-admin role', async () => {
    const token = jwt.sign({ userId: 1, role: 2 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test',
        password: 'testpassword',
        token: token,
        role: 2,
        email: 'test@test.com',
      }),
      find: jest.fn().mockResolvedValueOnce(testRoles),
    } as unknown as Repository<any>);
    try {
      const response = await axios.get('http://localhost:4000/roles', {
        headers: { authorization: `Bearer ${token}` },
      });
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
  });

  test('Should update a single Role by id', async () => {
    const token = jwt.sign({ userId: 1, role: 2 }, 'secret', { expiresIn: '24h' });
    const testUser = {
      firstName: 'test',
      password: 'testpassword',
      token: token,
      role: 1,
      email: 'test@test.com',
    };
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test',
        password: 'testpassword',
        token: token,
        role: 1,
        email: 'test@test.com',
      }),
      find: jest.fn().mockResolvedValueOnce(testRoles),
      update: jest.fn().mockResolvedValue({
        affected: 1,
      }),
    } as unknown as Repository<any>);
    try {
      const response = await axios.put(
        'http://localhost:4000/roles/1',
        { organization_name: 'test-role' },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      );

      expect(response.status).toBe(200);
      expect(response.data.affected).toBe(1);
    } catch (err) {
      console.log('---->', err.reponse);
    }
  });

  test('Should not update a single role by id for a non-admin token', async () => {
    const token = jwt.sign({ userId: 1, role: 2 }, 'secret', { expiresIn: '24h' });
    const testUser = {
      firstName: 'test',
      password: 'testpassword',
      token: token,
      role: 1,
      email: 'test@test.com',
    };
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test',
        password: 'testpassword',
        token: token,
        role: 2,
        email: 'test@test.com',
      }),
      find: jest.fn().mockResolvedValueOnce(testRoles),
      update: jest.fn().mockResolvedValue({
        affected: 1,
      }),
    } as unknown as Repository<any>);
    try {
      const response = await axios.put(
        'http://localhost:4000/roles/1',
        { role_name: 'test-role' },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      );

      expect(response.status).toBe(200);
      expect(response.data.affected).toBe(1);
    } catch (err) {
      console.log('err--------->',err.response )
      expect(err.response.status).toBe(401);
    }
  });

  test('Should not create  role for a token of non-admin role', async () => {
    const token = jwt.sign({ userId: 1, role: 2 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test',
        password: 'testpassword',
        token: token,
        role: 2,
        email: 'test@test.com',
      }),
      find: jest.fn().mockResolvedValueOnce(testRoles),
      save: jest.fn().mockResolvedValue({
        role_name: 'test-role',
        role_id: 'test-role',
      }),
    } as unknown as Repository<any>);
    try {
      const response = await axios.post(
        'http://localhost:4000/roles',
        {
          role_name: 'test-role',
        },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      );
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
  });
  test('Should create  role for a token of admin role', async () => {
    const token = jwt.sign({ userId: 1, role: 1 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test',
        password: 'testpassword',
        token: token,
        role: 1,
        email: 'test@test.com',
      }),
      find: jest.fn().mockResolvedValueOnce(testRoles),
      save: jest.fn().mockResolvedValue({
        role_name: 'test-role',
        role_id: 'test-role',
      }),
    } as unknown as Repository<any>);
    try {
      const response = await axios.post(
        'http://localhost:4000/roles',
        {
          role_name: 'test-role',
        },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      );
      expect(response.status).toBe(200);
      expect(response.data.role).toEqual({ role_name: 'test-role', role_id: 'test-role' });
    } catch (err) {
      console.log('er1or', err);
      expect(1 + 1).toBe(3);
    }
  });

  test('Should delete  role for a token of admin role', async () => {
    const token = jwt.sign({ userId: 1, role: 1 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test',
        password: 'testpassword',
        token: token,
        role: 1,
        email: 'test@test.com',
      }),
      find: jest.fn().mockResolvedValueOnce(testRoles),
      save: jest.fn().mockResolvedValue({
        role_name: 'test-role',
        role_id: 'test-role',
      }),
      delete: jest.fn().mockResolvedValue({
        raw: [],
        affected: 1,
      }),
    } as unknown as Repository<any>);
    try {
      const response = await axios.delete('http://localhost:4000/roles/2', {
        headers: { authorization: `Bearer ${token}` },
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ raw: [], affected: 1 });
    } catch (err) {
      console.log('er1or', err);
      expect(1 + 1).toBe(3);
    }
  });

  test('Should not delete  role for a token of non-admin role', async () => {
    const token = jwt.sign({ userId: 1, role: 2 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test',
        password: 'testpassword',
        token: token,
        role: 2,
        email: 'test@test.com',
      }),
      find: jest.fn().mockResolvedValueOnce(testRoles),
      save: jest.fn().mockResolvedValue({
        role_name: 'test-role',
        role_id: 'test-role',
      }),
      delete: jest.fn().mockResolvedValue({
        raw: [],
        affected: 1,
      }),
    } as unknown as Repository<any>);
    try {
      const response = await axios.delete('http://localhost:4000/roles/2', {
        headers: { authorization: `Bearer ${token}` },
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ raw: [], affected: 1 });
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
  });
});
