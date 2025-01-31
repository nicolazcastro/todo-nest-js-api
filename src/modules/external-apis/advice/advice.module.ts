import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AdviceService } from './advice.service';

@Module({
  imports: [HttpModule],
  providers: [AdviceService],
  exports: [AdviceService],
})
export class AdviceModule {}
