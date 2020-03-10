import { Module } from '@nestjs/common';
import { ClientsBenchmarkController } from './clients-benchmark.controller';
import { ClientsBenchmarkService } from './clients-benchmark.service';

@Module({
  controllers: [ClientsBenchmarkController],
  providers: [ClientsBenchmarkService]
})
export class ClientsBenchmarkModule {}
