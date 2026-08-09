import { IsString, IsNumber } from 'class-validator';

export class MoveTaskDto {
  @IsString() statusId!: string;
  @IsNumber() position!: number;
}