import { Controller, Get, Post, Body, Put, Param, Query } from '@nestjs/common';
import { CodeService } from '../services/code.service';
import { CreateCodeDto } from '../dto/code.dto';

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Get()
  verifyCode(@Query() query: any) {
    console.log('type query code', typeof query.code);
    return this.codeService.verifyCode(query);
  }

  @Post()
  createCode(@Body() createCodeDto: CreateCodeDto) {
    return this.codeService.createCode(createCodeDto);
  }

  @Put(':performance_id')
  rotateCode(@Param('performance_id') performance_id: string) {
    return this.codeService.updateCode(performance_id);
  }
}
