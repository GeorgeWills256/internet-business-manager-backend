import { IsString, IsOptional } from 'class-validator';

export class CreateManagerDto {
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  username?: string;
}