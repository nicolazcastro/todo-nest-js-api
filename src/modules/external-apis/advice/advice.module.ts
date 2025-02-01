import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AdviceService } from './advice.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [AdviceService],
  exports: [AdviceService], // <-- Make sure AdviceService is exported!
})
export class AdviceModule {}
