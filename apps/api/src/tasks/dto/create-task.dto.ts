import { Priority } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(Priority) priority?: Priority;
  @IsOptional() @IsString() statusId?: string;
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsString() parentTaskId?: string;
  @IsOptional() @IsDateString() dueDateStart?: string;
  @IsOptional() @IsDateString() dueDateEnd?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) assigneeIds?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) labelIds?: string[];
  @IsOptional() @IsBoolean() isLocked?: boolean;
}
