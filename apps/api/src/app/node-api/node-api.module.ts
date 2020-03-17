import { Module } from '@nestjs/common';
import { NodeApiController } from './node-api.controller';
import { NodeApiService } from './node-api.service';

@Module({
  controllers: [NodeApiController],
  providers: [NodeApiService]
})
export class NodeApiModule {}
