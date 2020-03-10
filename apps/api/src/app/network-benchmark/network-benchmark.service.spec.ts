import { Test, TestingModule } from '@nestjs/testing'
import { NetworkBenchmarkService } from './network-benchmark.service'

describe('NetworkBenchmarkService', () => {
  let service: NetworkBenchmarkService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkBenchmarkService],
    }).compile()

    service = module.get<NetworkBenchmarkService>(NetworkBenchmarkService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
