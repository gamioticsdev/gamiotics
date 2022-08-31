import { IsBoolean, IsString, IsInt, IsDate } from 'class-validator';
export class CreateCodeDto {
  @IsString()
  performance_id: string;

  @IsBoolean()
  rotates: boolean;
  @IsInt()
  rotation_frequency: number;
}

export class UpdateCodeDto {
  @IsString()
  performance_id: string;
}

export class ReturnCodeDto {
  @IsString()
  code: string;

  @IsDate()
  timestamp: Date;
}

export class VerifyCodeQuery {
  @IsString()
  code: string;

  @IsDate()
  timestamp: Date;
}
