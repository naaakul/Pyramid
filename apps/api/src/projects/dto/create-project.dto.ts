import { Priority } from '@prisma/client';
import { IsString, IsOptional, IsEnum, IsDateString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString() @MaxLength(120) name!: string;
  @IsOptional() @IsEnum(Priority) priority?: Priority;
  @IsOptional() @IsString() leadId?: string;
  @IsOptional() @IsDateString() dueDate?: string;
}