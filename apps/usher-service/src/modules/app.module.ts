import { Module } from '@nestjs/common';
import { CodeModule } from './code.module';

@Module({
  imports: [
    CodeModule,
    //make orm.config.ts later
  ],
})
export class AppModule {}
