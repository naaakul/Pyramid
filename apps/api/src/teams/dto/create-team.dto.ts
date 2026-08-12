import { IsString, MaxLength } from 'class-validator';
export class CreateTeamDto {
  @IsString() @MaxLength(60) name!: string;
}