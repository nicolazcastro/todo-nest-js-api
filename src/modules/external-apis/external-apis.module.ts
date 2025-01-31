import { Module } from '@nestjs/common';
import { AdviceModule } from './advice/advice.module';

@Module({
  imports: [AdviceModule],
})
export class ExternalApisModule {}
