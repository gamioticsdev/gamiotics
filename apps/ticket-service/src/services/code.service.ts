import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCodeDto, ReturnCodeDto, VerifyCodeQuery } from '../dto/code.dto';
import { Code } from '../entities/code';
import { randomUUID } from 'crypto';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(Code) private codeRepository: Repository<Code>,
  ) {}
  async createCode(createCodeBody: CreateCodeDto): Promise<ReturnCodeDto> {
    const newCode = await this.codeRepository.save({
      ...createCodeBody,
      created_at: new Date(),
    });

    return { code: newCode.code, timestamp: newCode.created_at };
  }

  async updateCode(performance_id: string): Promise<ReturnCodeDto> {
    const existingCode = await this.codeRepository.findOneBy({
      performance_id: performance_id,
    });

    if (!existingCode) {
      throw new HttpException('CODE NOT FOUND', HttpStatus.NOT_FOUND);
    }
    //update the code
    existingCode.code = randomUUID();
    await this.codeRepository.update(
      { performance_id: performance_id },
      { code: randomUUID() },
    );

    const codeUpdate = await this.codeRepository.findOneBy({
      performance_id: performance_id,
    });
    return { code: codeUpdate.code, timestamp: codeUpdate.created_at };
  }

  async verifyCode(query: VerifyCodeQuery): Promise<ReturnCodeDto> {
    console.log('timestamp', query.timestamp);
    const timestampToVerify = new Date(query.timestamp);
    const isTimeStampValid = timestampToVerify.getTime() > 0;

    if (!isTimeStampValid) {
      throw new HttpException('timestamp not valid', HttpStatus.BAD_REQUEST);
    }
    const code = await this.codeRepository.findOneBy({ code: query.code });

    if (!code) {
      throw new HttpException('Code NOT FOUND', HttpStatus.NOT_FOUND);
    }
    const creationTime = new Date(code.created_at);
    creationTime.setSeconds(
      creationTime.getSeconds() + 2 * code.rotation_frequency,
    );
    if (timestampToVerify.getTime() > creationTime.getTime()) {
      throw new HttpException('code expired', HttpStatus.BAD_REQUEST);
    }
    return { code: code.code, timestamp: code.created_at };
  }
}
