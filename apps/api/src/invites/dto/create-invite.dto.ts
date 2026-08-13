import { IsString, IsOptional } from 'class-validator';
export class CreateInviteDto {
  @IsString() invitedUserId!: string;
  @IsOptional() @IsString() taskId?: string;
  @IsOptional() @IsString() projectId?: string;
}