import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CodeService {

  async verifyCode(query: any): Promise<any> {
    //get otc and timestamp, request ticket-service for otc verification return
    const {otc, timestamp} = query;

    if(!otc ) {
      throw new Error('OTC required')
    }
    if(!timestamp) {
      throw new Error('timestamp required');
    }
    return "verified";
  }
}
