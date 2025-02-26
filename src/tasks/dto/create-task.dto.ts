import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre ne peut pas être vide' })
  @MinLength(3, { message: 'Le titre doit contenir au moins 3 caractères' })
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsOptional()
  @IsNumber()
  readonly userId?: number;
}
