import { Controller, Get, Post, Body, Put, Param, Query, Render } from '@nestjs/common';
import { CodeService } from '../services/code.service';
import QRCode from 'qrcode'


@Controller('qrcode')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Get('/generate')
  @Render('generate')
  async generateQRCode(@Query() query: any) {
    // request ticket-service for creating otc
    // encode url and otc into qr code
    //generate a template of qr code and return
    const src = await QRCode.toDataURL(JSON.stringify({url: 'localhost:8008', otc: 7343033}))
    return {src}
  }

  @Get('/verifyqrcode')
  verifyQRCode(@Query() query: any) {
    // get otc from query, request ticket service, if it resovles, return 200, otherwise 400
    return this.codeService.verifyCode(query);
  }
}
