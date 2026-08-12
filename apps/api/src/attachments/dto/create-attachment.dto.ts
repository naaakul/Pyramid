import { IsString, IsIn, MaxLength } from 'class-validator';

export class CreateAttachmentDto {
  @IsString() @MaxLength(200) name!: string;
  @IsString() url!: string;
  @IsIn(['link', 'file']) type!: 'link' | 'file';
}