import { Module } from '@nestjs/common';
import { CodeController } from 'src/controllers/code.controller';
import { CodeService } from 'src/services/code.service';
@Module({
  controllers: [CodeController],
  providers: [CodeService],
})
export class CodeModule {}
