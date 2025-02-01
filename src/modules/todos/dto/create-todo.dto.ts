import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateToDoDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
