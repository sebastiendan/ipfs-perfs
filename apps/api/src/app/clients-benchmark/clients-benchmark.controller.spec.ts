import { Test, TestingModule } from '@nestjs/testing'
import { ClientsBenchmarkController } from './clients-benchmark.controller'

describe('ClientsBenchmark Controller', () => {
  let controller: ClientsBenchmarkController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsBenchmarkController],
    }).compile()

    controller = module.get<ClientsBenchmarkController>(
      ClientsBenchmarkController
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
