import { IsString, IsOptional, MinLength } from 'class-validator';
export class CreateCommentDto {
  @IsString() @MinLength(1) body!: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() parentCommentId?: string;
}