import { Test, TestingModule } from '@nestjs/testing';
import { CodeController } from '../controllers/code.controller';
import { CodeService } from '../services/code.service';

describe('CodeController', () => {
  let codController: CodeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CodeController],
      providers: [
        CodeService,
      ],
    }).compile();

    codController = app.get<CodeController>(CodeController);
  });

  it('should pass', () => {
    expect(1+1).toBe(2);
   });
});