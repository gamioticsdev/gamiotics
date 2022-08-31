import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../entities';
import { CodeModule } from './code.module';
import { ormConfig } from 'ormconfig';

@Module({
  imports: [
    CodeModule,
    //make orm.config.ts later
    TypeOrmModule.forRoot(ormConfig),
  ],
})
export class AppModule {}
