/* eslint-disable no-unused-labels */
import { Repository } from 'typeorm';
import * as typeorm_functions from 'typeorm/globals';
import { App } from '../app';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { hashSync } from 'bcrypt';

describe('UsersController', () => {
  const testUsers = [
    {
      id: 1,
      firstName: 'testuser1',
      lastName: 'tl',
      email: 'test@test.com',
      organization_id: 'test-org',
      password: 'test-parssword',
      token: 'test-token',
      role: 1,
      nonce: 'test-nonce',
    },
    {
      id: 2,
      firstName: 'testuser1',
      lastName: 'tl',
      email: 'test@test.com',
      organization_id: 'test-org',
      password: 'test-parssword',
      token: 'test-token',
      role: 2,
      nonce: 'test-nonce',
    },
    {
      id: 3,
      firstName: 'testuser1',
      lastName: 'tl',
      email: 'test@test.com',
      organization_id: 'test-org',
      password: 'test-parssword',
      token: 'test-token',
      role: 3,
      nonce: 'test-nonce',
    },
    {
      id: 4,
      firstName: 'testuser1',
      lastName: 'tl',
      email: 'test@test.com',
      organization_id: 'test-org',
      password: 'test-parssword',
      token: 'test-token',
      role: 3,
      nonce: 'test-nonce',
    },
  ];
  const app = new App();
  beforeAll(async () => {
    app.initRoutes();
    app.listen();
  });

  afterAll(async () => app.close());

  test('Get All Users Without JWT should be failed', async () => {
    //create dummy nonce and dummy jwt
    const nonce = crypto.randomBytes(16).toString('base64');
    const userPassword = hashSync('test-password' + nonce, 10);
    const token = jwt.sign({ userId: 1, role: 1 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({ nonce: nonce, password: userPassword }),
      find: jest.fn().mockResolvedValueOnce(testUsers),
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
      delete: jest.fn().mockResolvedValueOnce({
        raw: [],
        affected: 1,
      }),
    } as unknown as Repository<any>);

    try {
      const response = await axios.get('http://localhost:4000/users', {
        headers: { authorization: `Bearer ${token}` },
      });
      expect(response.status).toBe(200);
      expect(response.data.length).toBe(4);
    } catch (err) {
      expect(err.response.data).toBe('jwt must be provided');
      expect(err.response.status).toBe(400);
    }
  });

  test('Should get all users for a token of admin role', async () => {
    const token = jwt.sign({ userId: 1, role: 1 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test',
        password: 'testpassword',
        token: token,
        role: 1,
        email: 'test@test.com',
      }),
      find: jest.fn().mockResolvedValueOnce(testUsers),
      save: jest.fn().mockResolvedValue({
        id: 1,
        firstName: 'test-user',
        lastName: 'test-rople',
        email: 'test@south.com',
        password: 'testpassword',
        role: 1,
        organization_id: 'test-company',
        token: token,
      }),
    } as unknown as Repository<any>);

    const response = await axios.get('http://localhost:4000/users', {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(response.status).toBe(200);
    expect(response.data.length).toBe(4);
    expect(response.data).toEqual(testUsers);
  });

  test('Should not get all users for a token of non-admin role', async () => {
    const token = jwt.sign({ userId: 1, role: 2 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test',
        password: 'testpassword',
        token: token,
        role: 2,
        email: 'test@test.com',
      }),
      find: jest.fn().mockResolvedValueOnce(testUsers),
      save: jest.fn().mockResolvedValue({
        id: 1,
        firstName: 'test-user',
        lastName: 'test-rople',
        email: 'test@south.com',
        password: 'testpassword',
        role: 1,
        organization_id: 'test-company',
        token: token,
      }),
    } as unknown as Repository<any>);
    try {
      const response = await axios.get('http://localhost:4000/users', {
        headers: { authorization: `Bearer ${token}` },
      });
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
  });

  test('Should get a single user by id', async () => {
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
      find: jest.fn().mockResolvedValueOnce(testUsers),
      save: jest.fn().mockResolvedValue({
        id: 1,
        firstName: 'test-user',
        lastName: 'test-rople',
        email: 'test@south.com',
        password: 'testpassword',
        role: 1,
        organization_id: 'test-company',
        token: token,
      }),
    } as unknown as Repository<any>);

    const response = await axios.get('http://localhost:4000/users/1', {
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.email).toBe(testUser.email);
    expect(response.data.firstName).toBe(testUser.firstName);
    expect(response.data.role).toBe(testUser.role);
  });

  test('Should not get a single user by id with token of non-admin user', async () => {
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
      find: jest.fn().mockResolvedValueOnce(testUsers),
      save: jest.fn().mockResolvedValue({
        id: 1,
        firstName: 'test-user',
        lastName: 'test-rople',
        email: 'test@south.com',
        password: 'testpassword',
        role: 1,
        organization_id: 'test-company',
        token: token,
      }),
    } as unknown as Repository<any>);

    try {
      const response = await axios.get('http://localhost:4000/users/2', {
        headers: { authorization: `Bearer ${token}` },
      });
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
  });

  test('Should update a single user by id', async () => {
    const token = jwt.sign({ userId: 1, role: 1 }, 'secret', { expiresIn: '24h' });
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
      find: jest.fn().mockResolvedValueOnce(testUsers),
      save: jest.fn().mockResolvedValue({
        id: 1,
        firstName: 'test-user-updated',
        lastName: 'test-updated',
        email: 'test@south.com',
        password: 'testpassword',
        role: 1,
        organization_id: 'test-company',
        token: token,
      }),
      delete: jest.fn().mockResolvedValueOnce((id) => {
        return { raw: [], affected: 1 };
      }),
    } as unknown as Repository<any>);

    const response = await axios.put(
      'http://localhost:4000/users/1',
      {
        firstName: 'test-user',
        lastName: 'test-rople',
      },
      {
        headers: { authorization: `Bearer ${token}` },
      },
    );
    try {
      expect(response.status).toBe(200);
      expect(response.data.firstName).toBe('test-user');
      expect(response.data.lastName).toBe('test-rople');
    } catch (err) {
      console.log('123', err);
    }
  });

  test('Should create a single user with token of admin role', async () => {
    const token = jwt.sign({ userId: 1, role: 1 }, 'secret', { expiresIn: '24h' });
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
      find: jest.fn().mockResolvedValueOnce(testUsers),
      save: jest.fn().mockResolvedValue({
        id: 1,
        firstName: 'test-user',
        lastName: 'test-rople',
        email: 'test@south.com',
        password: 'testpassword',
        role: 1,
        organization_id: 'test-company',
        token: token,
      }),
    } as unknown as Repository<any>);
    try {
      const response = await axios.post(
        'http://localhost:4000/users',
        {
          firstName: 'test-user',
          lastName: 'test-rople',
          email: 'test@south.com',
          password: 'testpassword',
          role: 1,
          organization_id: 'test-company',
          token: token,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      );

      expect(response.status).toBe(200);
    } catch (err) {
      console.log('err', err.response);
    }
  });

  test('Should not update users for a token of non-admin role', async () => {
    const token = jwt.sign({ userId: 1, role: 2 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test',
        password: 'testpassword',
        token: token,
        role: 2,
        email: 'test@test.com',
      }),
      find: jest.fn().mockResolvedValueOnce(testUsers),
      save: jest.fn().mockResolvedValue({
        id: 1,
        firstName: 'test-user',
        lastName: 'test-rople',
        email: 'test@south.com',
        password: 'testpassword',
        role: 1,
        organization_id: 'test-company',
        token: token,
      }),
    } as unknown as Repository<any>);
    try {
      const response = await axios.put(
        'http://localhost:4000/users/1',
        { firstName: 'updated-name' },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      );
    } catch (err) {
      console.log('err', err);
      expect(err.response.status).toBe(401);
    }
  });

  test('Should not create a single user with token of non admin role', async () => {
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
      find: jest.fn().mockResolvedValueOnce(testUsers),
      save: jest.fn().mockResolvedValue({
        id: 1,
        firstName: 'test-user',
        lastName: 'test-rople',
        email: 'test@south.com',
        password: 'testpassword',
        role: 1,
        organization_id: 'test-organization-unique',
        token: token,
      }),
    } as unknown as Repository<any>);
    try {
      const response = await axios.post(
        'http://localhost:4000/users',
        {
          id: 1,
          firstName: 'test-user',
          lastName: 'test-rople',
          email: 'test@south.com',
          password: 'testpassword',
          role: 1,
          organization_id: 'test-organization-unique',
        },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      );

      expect(response.status).toBe(200);
    } catch (err) {
      console.log('erruser', err);
      expect(err.response.status).toBe(401);
    }
  });
  //come back to it later
  // test('Should Delete a single user by id', async () => {
  //   const token = jwt.sign({ userId: 1, role: 1 }, 'secret', { expiresIn: '24h' });
  //   jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
  //     findOne: jest.fn().mockResolvedValue({
  //       firstName: 'test',
  //       password: 'testpassword',
  //       token: token,
  //       role: 1,
  //       email: 'test@test.com',
  //     }),
  //     delete: jest.fn().mockResolvedValueOnce({
  //       raw: [],
  //       affected: 1,
  //     }),
  //   } as unknown as Repository<any>);

  //   const response = await axios.delete('http://localhost:4000/users/8', {
  //     headers: { authorization: `Bearer ${token}` },
  //   });
  //   console.log('response', response);
  //   try {
  //     expect(response.status).toBe(200);
  //     expect(response.data.affected).toBe(1);
  //   } catch (err) {
  //     console.log('error', err);
  //     expect(1 + 1).toBe(3);
  //   }
  // });
});
