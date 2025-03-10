import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(title: string, description?: string): Promise<Task> {
    return this.prisma.task.create({
      data: { title, description },
    });
  }

  async getTasks(
    filter?: { title?: string; status?: string; createdAfter?: Date },
    orderBy?: 'asc' | 'desc',
    skip?: number,
    take?: number,
  ): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        title: filter?.title
          ? { contains: filter.title, mode: 'insensitive' }
          : undefined,
        status: filter?.status || undefined,
        createdAt: filter?.createdAfter
          ? { gte: filter.createdAfter }
          : undefined,
      },
      orderBy: { createdAt: orderBy || 'desc' },
      skip: skip || 0, // Offset (default: 0)
      take: take || 10, // Limit (default: 10)
    });
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async updateTask(id: string, field: string, value: string): Promise<Task> {
    const allowedFields = ['title', 'description', 'status'];
    if (!allowedFields.includes(field)) {
      throw new Error('Invalid field');
    }
    return this.prisma.task.update({
      where: { id },
      data: { [field]: value },
    });
  }

  async deleteTask(id: string): Promise<Task> {
    return this.prisma.task.delete({ where: { id } });
  }

  async deleteAllTasks(): Promise<void> {
    await this.prisma.task.deleteMany();
  }

  async seedTasks() {
    const tasks = Array.from({ length: 50 }, (_, i) => ({
      title: `Task ${i + 1}`,
      description: `Description for Task ${i + 1}`,
      status: i % 2 === 0 ? 'pending' : 'completed',
    }));

    await this.prisma.task.createMany({ data: tasks });
    return { message: 'DB populated with sample tasks' };
  }
}
