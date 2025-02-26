import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from '../entities/task-status.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Le titre doit contenir au moins 3 caractères' })
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Statut invalide' })
  readonly status?: TaskStatus;
}
