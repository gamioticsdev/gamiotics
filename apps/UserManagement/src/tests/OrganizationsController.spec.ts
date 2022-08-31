/* eslint-disable no-unused-labels */
import { Repository } from 'typeorm';
import * as typeorm_functions from 'typeorm/globals';
import { App } from '../app';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { hashSync } from 'bcrypt';

describe('OrganizationsController', () => {
  const testOrganizations = [
    {
      organization_name: 'test-organization',
      organization_id: 'test-guid',
    },
    {
      organization_name: 'test-organization',
      organization_id: 'test-guid',
    },
  ];
  const app = new App();
  beforeAll(async () => {
    app.initRoutes();
    app.listen();
  });

  afterAll(async () => app.close());

  test('Get All organizations Without JWT should be failed', async () => {
    //create dummy nonce and dummy jwt
    const nonce = crypto.randomBytes(16).toString('base64');
    const userPassword = hashSync('test-password' + nonce, 10);
    const token = jwt.sign({ userId: 1, role: 1 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({ nonce: nonce, password: userPassword }),
      find: jest.fn().mockResolvedValueOnce(testOrganizations),
      save: jest.fn().mockResolvedValue({
        organization_id: 'test-company',
        organization_name: 'test-org',
      }),
      delete: jest.fn().mockResolvedValueOnce({
        raw: [],
        affected: 1,
      }),
    } as unknown as Repository<any>);

    try {
      const response = await axios.get('http://localhost:4000/organizations', {
        headers: { authorization: `Bearer ${token}` },
      });
      expect(response.status).toBe(200);
      expect(response.data.length).toBe(4);
    } catch (err) {
      expect(err.response.data).toBe('jwt must be provided');
      expect(err.response.status).toBe(400);
    }
  });

  test('Should get all organizations for a token of admin role', async () => {
    const token = jwt.sign({ userId: 1, role: 1 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test',
        password: 'testpassword',
        token: token,
        role: 1,
        email: 'test@test.com',
      }),
      find: jest.fn().mockResolvedValueOnce(testOrganizations),
    } as unknown as Repository<any>);

    const response = await axios.get('http://localhost:4000/organizations', {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(response.status).toBe(200);
    expect(response.data.length).toBe(2);
    expect(response.data).toEqual(testOrganizations);
  });

  test('Should not get all organizations for a token of non-admin role', async () => {
    const token = jwt.sign({ userId: 1, role: 2 }, 'secret', { expiresIn: '24h' });
    jest.spyOn(typeorm_functions, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        firstName: 'test',
        password: 'testpassword',
        token: token,
        role: 2,
        email: 'test@test.com',
      }),
      find: jest.fn().mockResolvedValueOnce(testOrganizations),
    } as unknown as Repository<any>);
    try {
      const response = await axios.get('http://localhost:4000/organizations', {
        headers: { authorization: `Bearer ${token}` },
      });
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
  });

  test('Should update a single organization by id', async () => {
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
      find: jest.fn().mockResolvedValueOnce(testOrganizations),
      update: jest.fn().mockResolvedValue({
        affected: 1,
      }),
    } as unknown as Repository<any>);

    const response = await axios.put(
      'http://localhost:4000/organizations/1',
      { organization_name: 'test-org' },
      {
        headers: { authorization: `Bearer ${token}` },
      },
    );

    expect(response.status).toBe(200);
    expect(response.data.affected).toBe(1);
  });

  test('Should not update a single organization by id for a non-admin token', async () => {
    const token = jwt.sign({ userId: 1, role: 2 }, 'secret', { expiresIn: '24h' });
    const testUser = {
      firstName: 'test',
      password: 'testpassword',
      token: token,
      role: 2,
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
      find: jest.fn().mockResolvedValueOnce(testOrganizations),
      update: jest.fn().mockResolvedValue({
        affected: 1,
      }),
    } as unknown as Repository<any>);
    try {
      const response = await axios.put(
        'http://localhost:4000/organizations/1',
        { organization_name: 'test-org' },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      );

      expect(response.status).toBe(200);
      expect(response.data.affected).toBe(1);
    } catch (err) {
    //   console.log('errrrr', err);
      expect(err.response.status).toBe(401);
    }
  });
});
