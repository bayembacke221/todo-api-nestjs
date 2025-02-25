

# Documentation Todo API avec NestJS

## Table des matières

1. [Introduction](#introduction)
2. [Configuration initiale](#configuration-initiale)
3. [Structure du projet](#structure-du-projet)
4. [Modèles de données](#modèles-de-données)
    - [Entité Task](#entité-task)
    - [DTOs](#dtos)
5. [Implémentation des fonctionnalités](#implémentation-des-fonctionnalités)
    - [Module Tasks](#module-tasks)
    - [Service Tasks](#service-tasks)
    - [Contrôleur Tasks](#contrôleur-tasks)
6. [Fonctionnalités avancées](#fonctionnalités-avancées)
    - [Middlewares](#middlewares)
    - [Intercepteurs](#intercepteurs)
    - [Pipes personnalisés](#pipes-personnalisés)
    - [Guards](#guards)
    - [Filtres d'exception](#filtres-dexception)
7. [Configuration globale](#configuration-globale)
8. [Tests des endpoints](#tests-des-endpoints)
    - [Récupérer toutes les tâches](#récupérer-toutes-les-tâches)
    - [Récupérer une tâche spécifique](#récupérer-une-tâche-spécifique)
    - [Créer une tâche](#créer-une-tâche)
    - [Mettre à jour une tâche](#mettre-à-jour-une-tâche)
    - [Mettre à jour uniquement le statut](#mettre-à-jour-uniquement-le-statut)
    - [Supprimer une tâche](#supprimer-une-tâche)
9. [Concepts NestJS illustrés](#concepts-nestjs-illustrés)
10. [License](#license)

## Introduction

Cette documentation détaille une API de gestion de tâches (Todo API) développée avec NestJS. Ce projet illustre les concepts fondamentaux de NestJS tels que les modules, contrôleurs, services, middlewares, guards, pipes, intercepteurs et filtres d'exception.
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
## Configuration initiale

Pour démarrer le projet, suivez ces étapes :

```bash
# Installer la CLI NestJS (si ce n'est pas déjà fait)
npm i -g @nestjs/cli

# Créer un nouveau projet
nest new todo_app

# Se déplacer dans le dossier du projet
cd todo_app

# Installer les dépendances pour la validation
npm install class-validator class-transformer
```

## Structure du projet

Voici la structure complète du projet :

```
todo_app/
├── src/
│   ├── tasks/
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts
│   │   │   └── update-task.dto.ts
│   │   ├── entities/
│   │   │   └── task.entity.ts
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   ├── tasks.module.ts
│   │   └── tasks.middleware.ts
│   ├── common/
│   │   ├── interceptors/
│   │   │   └── logging.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   └── api-key.guard.ts
│   │   └── pipes/
│   │       └── task-status-validation.pipe.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Modèles de données

### Entité Task

L'entité `Task` représente une tâche dans notre système :

```typescript
// src/tasks/entities/task.entity.ts
export class Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
}

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
```

### DTOs

Les Data Transfer Objects (DTOs) sont utilisés pour valider les données entrantes :

**CreateTaskDto** :
```typescript
// src/tasks/dto/create-task.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  description: string;
}
```

**UpdateTaskDto** :
```typescript
// src/tasks/dto/update-task.dto.ts
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
```

## Implémentation des fonctionnalités

### Module Tasks

Le module `TasksModule` encapsule toutes les fonctionnalités liées aux tâches :

```typescript
// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

### Service Tasks

Le service `TasksService` contient la logique métier :

```typescript
// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private idCounter = 1;

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    
    const task: Task = {
      id: this.idCounter++,
      title,
      description,
      status: TaskStatus.OPEN,
      createdAt: new Date(),
    };

    this.tasks.push(task);
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id);
    
    if (updateTaskDto.title) {
      task.title = updateTaskDto.title;
    }
    
    if (updateTaskDto.description) {
      task.description = updateTaskDto.description;
    }
    
    if (updateTaskDto.status) {
      task.status = updateTaskDto.status;
    }
    
    return task;
  }

  remove(id: number): void {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    this.tasks.splice(taskIndex, 1);
  }
}
```

### Contrôleur Tasks

Le contrôleur `TasksController` définit les routes de l'API :

```typescript
// src/tasks/tasks.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseFilters, UseInterceptors, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatusValidationPipe } from '../common/pipes/task-status-validation.pipe';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Controller('tasks')
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @UseGuards(ApiKeyGuard) // Protection avec une clé API
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard) // Protection avec une clé API
  remove(@Param('id', ParseIntPipe) id: number) {
    this.tasksService.remove(id);
    return { message: 'Task deleted successfully' };
  }
  
  @Put(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: string,
  ) {
    return this.tasksService.update(id, { status: status as any });
  }
}
```

## Fonctionnalités avancées

### Middlewares

Le middleware pour enregistrer les requêtes :

```typescript
// src/tasks/tasks.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TasksLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[Middleware] Request to Tasks API: ${req.method} ${req.url}`);
    next();
  }
}
```

Configuration du middleware dans `AppModule` :

```typescript
// src/app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TasksLoggerMiddleware } from './tasks/tasks.middleware';

@Module({
  imports: [TasksModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TasksLoggerMiddleware)
      .forRoutes('tasks');
  }
}
```

### Intercepteurs

L'intercepteur pour mesurer le temps de traitement :

```typescript
// src/common/interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    console.log(`[REQUEST] ${method} ${url}`);

    return next
      .handle()
      .pipe(
        tap(() => {
          console.log(`[RESPONSE] ${method} ${url} - ${Date.now() - now}ms`);
        }),
      );
  }
}
```

### Pipes personnalisés

Le pipe de validation pour les statuts de tâches :

```typescript
// src/common/pipes/task-status-validation.pipe.ts
import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../../tasks/entities/task.entity';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any) {
    if (!value) return value;
    
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    return this.allowedStatuses.includes(status);
  }
}
```

### Guards

Le guard pour la protection par clé API :

```typescript
// src/common/guards/api-key.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly API_KEY = 'my-api-key-123';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || apiKey !== this.API_KEY) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
```

### Filtres d'exception

Le filtre pour formater les exceptions :

```typescript
// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
  }
}
```

## Configuration globale

Configuration de l'application dans `main.ts` :

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration globale pour la validation des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non décorées
      forbidNonWhitelisted: true, // Rejette les requêtes avec des propriétés non autorisées
      transform: true, // Transforme automatiquement les types primitifs
    }),
  );
  
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
```

## Tests des endpoints

Pour tester l'API, vous pouvez utiliser des outils comme Postman, cURL ou tout autre client HTTP. Voici les différents endpoints disponibles et comment les tester :

### Récupérer toutes les tâches

```
GET http://localhost:3000/tasks
```

Exemple avec cURL :
```bash
curl -X GET http://localhost:3000/tasks
```

Réponse attendue (exemple) :
```json
[]
```
(Tableau vide initialement, puis contenant des tâches après création)

### Récupérer une tâche spécifique

```
GET http://localhost:3000/tasks/:id
```

Exemple avec cURL :
```bash
curl -X GET http://localhost:3000/tasks/1
```

Réponse attendue (exemple) :
```json
{
  "id": 1,
  "title": "Apprendre NestJS",
  "description": "Suivre le tutoriel complet",
  "status": "OPEN",
  "createdAt": "2025-02-25T10:30:45.123Z"
}
```

Si la tâche n'existe pas, vous recevrez une erreur 404 avec un message formaté par le filtre d'exception.

### Créer une tâche

```
POST http://localhost:3000/tasks
```

Cette route nécessite une clé API dans les en-têtes :
- X-API-Key: my-api-key-123

Exemple avec cURL :
```bash
curl -X POST \
  http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: my-api-key-123' \
  -d '{
    "title": "Apprendre NestJS",
    "description": "Suivre le tutoriel complet"
}'
```

Réponse attendue :
```json
{
  "id": 1,
  "title": "Apprendre NestJS",
  "description": "Suivre le tutoriel complet",
  "status": "OPEN",
  "createdAt": "2025-02-25T10:30:45.123Z"
}
```

Si la clé API est absente ou incorrecte, vous recevrez une erreur 401 (Unauthorized).

### Mettre à jour une tâche

```
PUT http://localhost:3000/tasks/:id
```

Exemple avec cURL :
```bash
curl -X PUT \
  http://localhost:3000/tasks/1 \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Apprendre NestJS en profondeur",
    "description": "Suivre le tutoriel complet et faire le mini-projet",
    "status": "IN_PROGRESS"
}'
```

Réponse attendue :
```json
{
  "id": 1,
  "title": "Apprendre NestJS en profondeur",
  "description": "Suivre le tutoriel complet et faire le mini-projet",
  "status": "IN_PROGRESS",
  "createdAt": "2025-02-25T10:30:45.123Z"
}
```

### Mettre à jour uniquement le statut

```
PUT http://localhost:3000/tasks/:id/status
```

Exemple avec cURL :
```bash
curl -X PUT \
  http://localhost:3000/tasks/1/status \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "DONE"
}'
```

Réponse attendue :
```json
{
  "id": 1,
  "title": "Apprendre NestJS en profondeur",
  "description": "Suivre le tutoriel complet et faire le mini-projet",
  "status": "DONE",
  "createdAt": "2025-02-25T10:30:45.123Z"
}
```

Si le statut fourni n'est pas valide, le pipe de validation `TaskStatusValidationPipe` rejettera la requête avec une erreur 400 (Bad Request).

### Supprimer une tâche

```
DELETE http://localhost:3000/tasks/:id
```

Cette route nécessite également une clé API dans les en-têtes :
- X-API-Key: my-api-key-123

Exemple avec cURL :
```bash
curl -X DELETE \
  http://localhost:3000/tasks/1 \
  -H 'X-API-Key: my-api-key-123'
```

Réponse attendue :
```json
{
  "message": "Task deleted successfully"
}
```

## Concepts NestJS illustrés

Ce projet démontre les concepts fondamentaux de NestJS suivants :

1. **Modules** - Organisation du code en modules fonctionnels
2. **Contrôleurs** - Définition des routes et gestion des requêtes HTTP
3. **Providers/Services** - Encapsulation de la logique métier
4. **DTOs et validation** - Validation des données entrantes
5. **Pipes** - Transformation et validation des données
6. **Guards** - Protection des routes
7. **Intercepteurs** - Modification des requêtes/réponses
8. **Middlewares** - Traitement des requêtes
9. **Filtres d'exception** - Gestion centralisée des erreurs
10. **Injection de dépendances** - Couplage faible entre les composants

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
