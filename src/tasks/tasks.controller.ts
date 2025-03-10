import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  createTask(
    @Body('title') title: string,
    @Body('description') description?: string,
  ) {
    return this.tasksService.createTask(title, description);
  }

  @Get()
  getTasks(
    @Query('title') title?: string,
    @Query('status') status?: string,
    @Query('createdAfter') createdAfter?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    const filters = {
      title,
      status,
      createdAfter: createdAfter ? new Date(createdAfter) : undefined,
    };
    return this.tasksService.getTasks(
      filters,
      orderBy,
      Number(skip),
      Number(take),
    );
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @Body('field') field: string,
    @Body('value') value: string,
  ) {
    return this.tasksService.updateTask(id, field, value);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    await this.tasksService.deleteTask(id);
    return { message: 'Task deleted' };
  }

  @Delete()
  deleteAllTasks() {
    return this.tasksService.deleteAllTasks();
  }

  @Post('seed')
  seedTasks() {
    return this.tasksService.seedTasks();
  }
}
