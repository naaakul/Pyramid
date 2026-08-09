import { Priority } from '@prisma/client';
import { IsOptional, IsString, IsEnum, IsIn } from 'class-validator';

export class QueryTasksDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() statusId?: string;
  @IsOptional() @IsEnum(Priority) priority?: Priority;
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsString() assigneeId?: string;
  @IsOptional() @IsString() labelId?: string;
  @IsOptional() @IsString() reporterId?: string;
  @IsOptional() @IsIn(['overdue', 'no_date']) dueDate?: 'overdue' | 'no_date';
}