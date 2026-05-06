# Tasks API

This project is the **Week 21: NestJS Fundamentals** deliverable from the image:

- **Deliverable:** Basic REST API
- **Project:** Tasks API (in-memory)

## Daily topics covered

- **Day 1:** NestJS setup, project structure, scripts
- **Day 2:** Modules and controllers
- **Day 3:** Services and dependency injection
- **Day 4:** DTOs and `class-validator`
- **Day 5:** In-memory Tasks REST API

## Learning goals covered

- NestJS architecture (MVC-style structure)
- Modules, controllers, services
- Dependency injection
- DTOs and validation

## API endpoints

- `GET /` - overview of the project and the day-wise topics
- `GET /tasks` - get all tasks
- `GET /tasks/:id` - get one task
- `POST /tasks` - create a task
- `PATCH /tasks/:id` - update a task
- `DELETE /tasks/:id` - delete a task

## Example request body

```json
{
  "title": "Learn NestJS controllers",
  "description": "Practice routes and decorators",
  "status": "todo"
}
```

## Validation rules

- `title` is required when creating a task
- `title` must be between 3 and 100 characters
- `description` is optional and can be up to 300 characters
- `status` is optional and must be one of `todo`, `in-progress`, `done`

## Run the project

```bash
npm install
npm run start:dev
```
