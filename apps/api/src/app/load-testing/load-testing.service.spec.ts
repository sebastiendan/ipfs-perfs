import { Test, TestingModule } from '@nestjs/testing'
import { LoadTestingService } from './load-testing.service'

describe('LoadTestingService', () => {
  let service: LoadTestingService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoadTestingService],
    }).compile()

    service = module.get<LoadTestingService>(LoadTestingService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
