import { Test, TestingModule } from '@nestjs/testing'
import { NetworkBenchmarkController } from './network-benchmark.controller'

describe('NetworkBenchmark Controller', () => {
  let controller: NetworkBenchmarkController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NetworkBenchmarkController],
    }).compile()

    controller = module.get<NetworkBenchmarkController>(
      NetworkBenchmarkController
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
