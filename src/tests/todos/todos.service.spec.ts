// src/tests/todos/todos.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from '../../modules/todos/todos.service';
import { getModelToken } from '@nestjs/mongoose';
import { ToDo } from '../../modules/todos/schemas/todo.schema';
import { Model } from 'mongoose';
import { AdviceService } from '../../modules/external-apis/advice/advice.service';

describe('TodosService', () => {
  let service: TodosService;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let model: Model<ToDo>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let adviceService: AdviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        AdviceService,
        {
          provide: getModelToken(ToDo.name),
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            find: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    model = module.get<Model<ToDo>>(getModelToken(ToDo.name));
    adviceService = module.get<AdviceService>(AdviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests here
});
