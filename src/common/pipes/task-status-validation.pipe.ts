import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../../tasks/entities/task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any): TaskStatus {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException(`Value is missing or invalid`);
    }

    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }

    return value as TaskStatus;
  }

  private isStatusValid(status: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.allowedStatuses.includes(status);
  }
}
