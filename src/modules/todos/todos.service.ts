import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateToDoDto } from './dto/create-todo.dto';
import { UpdateToDoDto } from './dto/update-todo.dto';
import { ToDo, ToDoDocument } from './schemas/todo.schema';
import { AdviceService } from '../external-apis/advice/advice.service';

// Assuming your user object has this shape. You can define an interface for better typing.
export interface AuthenticatedUser {
  userId: string;
  username: string;
}

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(ToDo.name) private readonly todoModel: Model<ToDoDocument>,
    private readonly adviceService: AdviceService,
  ) {}

  /**
   * Creates a new ToDo item.
   * It fetches advice from an external API and associates it with the new ToDo.
   *
   * @param createToDoDto - Data Transfer Object for creating a ToDo.
   * @param user - The authenticated user making the request.
   * @returns The created ToDo document.
   */
  async create(
    createToDoDto: CreateToDoDto,
    user: AuthenticatedUser,
  ): Promise<ToDo> {
    // Fetch advice from the external API
    const advice: string = await this.adviceService.getAdvice();

    // Create a new ToDo document
    const createdToDo = new this.todoModel({
      ...createToDoDto,
      advice,
      user: user.userId, // assuming your JWT strategy attaches a property "userId"
    });

    return createdToDo.save();
  }

  /**
   * Retrieves all ToDo items for the authenticated user, sorted by creation date descending.
   *
   * @param user - The authenticated user.
   * @returns An array of ToDo documents.
   */
  async findAll(user: AuthenticatedUser): Promise<ToDo[]> {
    return this.todoModel
      .find({ user: user.userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Retrieves a single ToDo item by ID for the authenticated user.
   *
   * @param id - The ID of the ToDo.
   * @param user - The authenticated user.
   * @returns The ToDo document.
   * @throws NotFoundException if the ToDo is not found.
   */
  async findOne(id: string, user: AuthenticatedUser): Promise<ToDo> {
    const todo = await this.todoModel
      .findOne({ _id: id, user: user.userId })
      .exec();
    if (!todo) {
      throw new NotFoundException(`ToDo with ID ${id} not found`);
    }
    return todo;
  }

  /**
   * Updates a ToDo item by ID for the authenticated user.
   *
   * @param id - The ID of the ToDo.
   * @param updateToDoDto - Data Transfer Object for updating a ToDo.
   * @param user - The authenticated user.
   * @returns The updated ToDo document.
   * @throws NotFoundException if the ToDo is not found.
   */
  async update(
    id: string,
    updateToDoDto: UpdateToDoDto,
    user: AuthenticatedUser,
  ): Promise<ToDo> {
    const updatedToDo = await this.todoModel
      .findOneAndUpdate(
        { _id: id, user: user.userId },
        { ...updateToDoDto },
        { new: true },
      )
      .exec();
    if (!updatedToDo) {
      throw new NotFoundException(`ToDo with ID ${id} not found`);
    }
    return updatedToDo;
  }

  /**
   * Deletes a ToDo item by ID for the authenticated user.
   *
   * @param id - The ID of the ToDo.
   * @param user - The authenticated user.
   * @returns An object with a deletion message.
   * @throws NotFoundException if the ToDo is not found.
   */
  async remove(
    id: string,
    user: AuthenticatedUser,
  ): Promise<{ message: string }> {
    const deletedToDo = await this.todoModel
      .findOneAndDelete({ _id: id, user: user.userId })
      .exec();
    if (!deletedToDo) {
      throw new NotFoundException(`ToDo with ID ${id} not found`);
    }
    return { message: 'ToDo deleted successfully' };
  }
}
