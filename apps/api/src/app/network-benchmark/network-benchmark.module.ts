import { Module } from '@nestjs/common';
import { NetworkBenchmarkController } from './network-benchmark.controller';
import { NetworkBenchmarkService } from './network-benchmark.service';

@Module({
  controllers: [NetworkBenchmarkController],
  providers: [NetworkBenchmarkService]
})
export class NetworkBenchmarkModule {}
