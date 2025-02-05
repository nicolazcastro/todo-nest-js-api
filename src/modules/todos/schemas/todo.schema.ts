import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type ToDoDocument = ToDo & Document;

@Schema()
export class ToDo {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  advice?: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ToDoSchema = SchemaFactory.createForClass(ToDo);
ToDoSchema.index({ user: 1 });
