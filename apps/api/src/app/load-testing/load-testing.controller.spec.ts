import { Test, TestingModule } from '@nestjs/testing'
import { LoadTestingController } from './load-testing.controller'

describe('LoadTesting Controller', () => {
  let controller: LoadTestingController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoadTestingController],
    }).compile()

    controller = module.get<LoadTestingController>(LoadTestingController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
