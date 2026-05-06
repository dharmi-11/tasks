import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];
  private nextId = 1;

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find((item) => item.id === id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} was not found.`);
    }

    return task;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: this.nextId++,
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status ?? TaskStatus.TODO,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.push(task);
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id);

    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }

    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }

    if (updateTaskDto.status !== undefined) {
      task.status = updateTaskDto.status;
    }

    task.updatedAt = new Date().toISOString();
    return task;
  }

  remove(id: number): { message: string; deletedTask: Task } {
    const task = this.findOne(id);
    const index = this.tasks.findIndex((item) => item.id === id);

    this.tasks.splice(index, 1);

    return {
      message: `Task with id ${id} deleted successfully.`,
      deletedTask: task,
    };
  }
}

