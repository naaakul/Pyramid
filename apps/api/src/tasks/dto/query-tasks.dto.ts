import { Priority } from '@prisma/client';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class QueryTasksDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() statusId?: string;
  @IsOptional() @IsEnum(Priority) priority?: Priority;
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsString() assigneeId?: string;
}