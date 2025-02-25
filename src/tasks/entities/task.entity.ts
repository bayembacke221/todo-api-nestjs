import { TaskStatus } from './task-status.enum';

export class Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
}
