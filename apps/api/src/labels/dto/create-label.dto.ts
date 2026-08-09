import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateLabelDto {
  @IsString() @MaxLength(40) name!: string;
  @IsOptional() @IsString() color?: string;
}