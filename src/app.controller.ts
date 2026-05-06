import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  renderLanding(@Res() response: any): void {
    response.sendFile(join(process.cwd(), 'public', 'index.html'));
  }

  @Get('api-info')
  getWelcome() {
    return {
      week: 'Week 21: NestJS Fundamentals',
      deliverable: 'Basic REST API',
      learningGoals: [
        'NestJS architecture (MVC)',
        'Modules, controllers, services',
        'Dependency injection',
        'DTOs and validation',
      ],
      dailyTasks: [
        'Day 1: NestJS setup, CLI',
        'Day 2: Modules, controllers basics',
        'Day 3: Services, dependency injection',
        'Day 4: DTOs, class-validator',
        'Day 5: Project - Tasks API (in-memory)',
      ],
      endpoints: {
        allTasks: 'GET /tasks',
        singleTask: 'GET /tasks/:id',
        createTask: 'POST /tasks',
        updateTask: 'PATCH /tasks/:id',
        deleteTask: 'DELETE /tasks/:id',
      },
    };
  }
}
