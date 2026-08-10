import { ThemeMode, ColorMode } from '@prisma/client';
import { IsOptional, IsEnum } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional() @IsEnum(ThemeMode) themeMode?: ThemeMode;
  @IsOptional() @IsEnum(ColorMode) colorMode?: ColorMode;
}