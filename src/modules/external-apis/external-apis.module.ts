import { Module } from '@nestjs/common';
import { AdviceModule } from './advice/advice.module';

@Module({
  imports: [AdviceModule],
  exports: [AdviceModule], // <-- Exports AdviceModule so its providers (AdviceService) are available
})
export class ExternalApisModule {}
