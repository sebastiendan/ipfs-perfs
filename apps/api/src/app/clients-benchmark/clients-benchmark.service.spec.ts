import { Test, TestingModule } from '@nestjs/testing'
import { ClientsBenchmarkService } from './clients-benchmark.service'

describe('ClientsBenchmarkService', () => {
  let service: ClientsBenchmarkService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsBenchmarkService],
    }).compile()

    service = module.get<ClientsBenchmarkService>(ClientsBenchmarkService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
