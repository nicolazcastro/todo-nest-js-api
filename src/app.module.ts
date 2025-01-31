import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ExternalApisModule } from './modules/external-apis/external-apis.module';
import { TodosModule } from './modules/todos/todos.module';

const mongoDBURI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/nestjs-todo-app';
@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally
      envFilePath: '.env', // Specifies the path to the .env file
    }),
    // Mongoose Module for MongoDB connection
    MongooseModule.forRoot(mongoDBURI),
    // Functional Modules
    AuthModule,
    TodosModule,
    ExternalApisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
