import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { ToDo, ToDoSchema } from './schemas/todo.schema';
import { ExternalApisModule } from '../external-apis/external-apis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ToDo.name, schema: ToDoSchema }]),
    ExternalApisModule, // <-- Import this module so AdviceService is available
  ],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
