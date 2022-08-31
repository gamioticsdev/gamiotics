import { Module } from '@nestjs/common';
import { CodeController } from 'src/controllers/code.controller';
import { CodeService } from 'src/services/code.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Code } from 'src/entities/code';
@Module({
  imports: [TypeOrmModule.forFeature([Code])],
  controllers: [CodeController],
  providers: [CodeService],
})
export class CodeModule {}
