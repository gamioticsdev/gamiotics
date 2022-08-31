import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CodeController } from '../controllers/code.controller';
import { CodeService } from '../services/code.service';
import { Code } from '../entities/code';
import { Repository } from 'typeorm';
import Validator from 'validator';
import { randomUUID } from 'crypto';

describe('CodeController', () => {
  let codController: CodeController;
  let repo: Repository<Code>;
  const dummyDate = new Date();
  const dummycode = { code: 'dummy-code', created_at: dummyDate };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CodeController],
      providers: [
        CodeService,
        {
          provide: getRepositoryToken(Code),
          useClass: Repository,
        },
      ],
    }).compile();

    codController = app.get<CodeController>(CodeController);
    repo = app.get<Repository<Code>>(getRepositoryToken(Code));
  });

  describe('root', () => {
    it('should create the OTC"', async () => {
      jest.spyOn(repo, 'save').mockResolvedValueOnce({
        performance_id: 'dummy-performance',
        rotates: true,
        rotation_frequency: 30,
        created_at: dummyDate,
        code: 'dummy-code',
      });
      expect(
        await codController.createCode({
          performance_id: 'dummy-performance',
          rotates: true,
          rotation_frequency: 30,
        }),
      ).toEqual({ code: 'dummy-code', timestamp: dummycode.created_at });
    });

    it('should rotate the OTC', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValue({
        code: dummycode.code,
        performance_id: 'dummy-performance',
        rotates: true,
        rotation_frequency: 30,
        created_at: dummyDate,
      });
      jest
        .spyOn(repo, 'update')
        .mockResolvedValue({ raw: [], affected: 1, generatedMaps: [] });
      const rotatedCode = await codController.rotateCode('dummy-performanc_id');
      expect(Validator.isUUID(rotatedCode.code)).toBe(true);
      expect(rotatedCode.timestamp).toEqual(dummyDate);
    });

    it('should return 404 non-existing performance-id', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(undefined);
      try {
        await codController.rotateCode('dummy-performanc_id');
      } catch (err) {
        expect(err.status).toBe(404);
      }
    });

    it('should verify the code successfully', async () => {
      const testOtcCodeObject: Code = {
        performance_id: randomUUID(),
        code: randomUUID(),
        rotates: true,
        rotation_frequency: 30,
        created_at: new Date(),
      };

      jest.spyOn(repo, 'findOneBy').mockResolvedValue(testOtcCodeObject);
      const timestamp = testOtcCodeObject.created_at;
      timestamp.setSeconds(timestamp.getSeconds() + 30);
      const verifiedCOde = await codController.verifyCode({
        code: testOtcCodeObject.code,
        timestamp: timestamp,
      });
      expect(verifiedCOde.code).toBe(testOtcCodeObject.code);
      expect(verifiedCOde.timestamp).toBe(testOtcCodeObject.created_at);
    });

    it('verification should fail for expired otc', async () => {
      const testOtcCodeObject: Code = {
        performance_id: randomUUID(),
        code: randomUUID(),
        rotates: true,
        rotation_frequency: 30,
        created_at: new Date(),
      };
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(testOtcCodeObject);
      const timestamp = new Date(testOtcCodeObject.created_at);
      timestamp.setSeconds(
        timestamp.getSeconds() + 3 * testOtcCodeObject.rotation_frequency,
      );
      try {
        const verifiedCOde = await codController.verifyCode({
          code: testOtcCodeObject.code,
          timestamp: timestamp,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('code expired');
      }
    });
  });
});
