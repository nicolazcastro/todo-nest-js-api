/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import {
  TodosService,
  AuthenticatedUser,
} from '../../modules/todos/todos.service';
import { getModelToken } from '@nestjs/mongoose';
import { ToDo } from '../../modules/todos/schemas/todo.schema';
import { AdviceService } from '../../modules/external-apis/advice/advice.service';
import { NotFoundException } from '@nestjs/common';

// A helper function to simulate a new ToDo instance.
// When new this.todoModel() is called, we simulate an instance with a save() method.
const createMockToDoInstance = (data: any) => ({
  ...data,
  save: jest.fn().mockResolvedValue({ _id: 'todo1', ...data }),
});

// We'll define our fake authenticated user.
const fakeUser: AuthenticatedUser = { userId: 'user123', username: 'testuser' };

describe('TodosService', () => {
  let service: TodosService;

  // Create a mock for the ToDo model.
  // We need to support both "new" (for creating a new instance) and static methods.
  const mockToDoModel = jest.fn() as any;
  // Attach static methods to the mock model.
  mockToDoModel.find = jest.fn();
  mockToDoModel.findOne = jest.fn();
  mockToDoModel.findOneAndUpdate = jest.fn();
  mockToDoModel.findOneAndDelete = jest.fn();

  // Create a mock for AdviceService.
  const mockAdviceService = {
    getAdvice: jest.fn().mockResolvedValue('Always check your groceries!'),
  };

  beforeEach(async () => {
    // Reset all mocks before each test.
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: getModelToken(ToDo.name), useValue: mockToDoModel },
        { provide: AdviceService, useValue: mockAdviceService },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  describe('create', () => {
    it('should create a new ToDo with advice', async () => {
      const createDto = { title: 'Buy milk', description: 'Whole milk' };

      // Simulate AdviceService.getAdvice() returning advice.
      mockAdviceService.getAdvice.mockResolvedValue('Fresh milk advice');

      // When creating a new ToDo, the service does:
      // new this.todoModel({ ...createDto, advice, user: user.userId }).save()
      // We'll simulate the constructor call by having our mock function behave as a constructor.
      // For that, we override our mockToDoModel to return a fake instance.
      mockToDoModel.mockImplementation((data: any) =>
        createMockToDoInstance(data),
      );

      const result = await service.create(createDto, fakeUser);

      // Ensure that advice is fetched.
      expect(mockAdviceService.getAdvice).toHaveBeenCalled();

      // Ensure that the mock constructor was called with the correct data.
      expect(mockToDoModel).toHaveBeenCalledWith({
        ...createDto,
        advice: 'Fresh milk advice',
        user: fakeUser.userId,
      });

      // Check that the instance's save method was called.
      // Our fake instance returns an object with _id: 'todo1'.
      expect(result).toEqual({
        _id: 'todo1',
        ...createDto,
        advice: 'Fresh milk advice',
        user: fakeUser.userId,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of ToDos for the user', async () => {
      const fakeToDos = [
        {
          _id: 'todo1',
          title: 'Task 1',
          user: fakeUser.userId,
          createdAt: new Date(),
        },
        {
          _id: 'todo2',
          title: 'Task 2',
          user: fakeUser.userId,
          createdAt: new Date(),
        },
      ];
      // Simulate the chain: this.todoModel.find({ user: ... }).sort({ createdAt: -1 }).exec()
      const sortMock = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(fakeToDos) });
      (mockToDoModel.find as jest.Mock).mockReturnValue({ sort: sortMock });

      const result = await service.findAll(fakeUser);
      expect(mockToDoModel.find).toHaveBeenCalledWith({
        user: fakeUser.userId,
      });
      expect(result).toEqual(fakeToDos);
    });
  });

  describe('findOne', () => {
    it('should return a ToDo if found', async () => {
      const fakeToDo = { _id: 'todo1', title: 'Task 1', user: fakeUser.userId };
      (mockToDoModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(fakeToDo),
      });

      const result = await service.findOne('todo1', fakeUser);
      expect(mockToDoModel.findOne).toHaveBeenCalledWith({
        _id: 'todo1',
        user: fakeUser.userId,
      });
      expect(result).toEqual(fakeToDo);
    });

    it('should throw NotFoundException if ToDo is not found', async () => {
      (mockToDoModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findOne('invalidId', fakeUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the ToDo if found', async () => {
      const updateDto = { title: 'Updated Task' };
      const updatedToDo = { _id: 'todo1', ...updateDto, user: fakeUser.userId };
      (mockToDoModel.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedToDo),
      });

      const result = await service.update('todo1', updateDto, fakeUser);
      expect(mockToDoModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'todo1', user: fakeUser.userId },
        { ...updateDto },
        { new: true },
      );
      expect(result).toEqual(updatedToDo);
    });

    it('should throw NotFoundException if ToDo is not found during update', async () => {
      (mockToDoModel.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      const updateDto = { title: 'Updated Task' };
      await expect(
        service.update('invalidId', updateDto, fakeUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete the ToDo and return a success message', async () => {
      const deletedToDo = {
        _id: 'todo1',
        title: 'Task 1',
        user: fakeUser.userId,
      };
      (mockToDoModel.findOneAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(deletedToDo),
      });

      const result = await service.remove('todo1', fakeUser);
      expect(mockToDoModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'todo1',
        user: fakeUser.userId,
      });
      expect(result).toEqual({ message: 'ToDo deleted successfully' });
    });

    it('should throw NotFoundException if ToDo is not found during deletion', async () => {
      (mockToDoModel.findOneAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.remove('invalidId', fakeUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
