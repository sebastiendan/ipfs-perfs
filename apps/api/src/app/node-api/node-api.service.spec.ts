import { Test, TestingModule } from '@nestjs/testing';
import { NodeApiService } from './node-api.service';

describe('NodeApiService', () => {
  let service: NodeApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NodeApiService],
    }).compile();

    service = module.get<NodeApiService>(NodeApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
