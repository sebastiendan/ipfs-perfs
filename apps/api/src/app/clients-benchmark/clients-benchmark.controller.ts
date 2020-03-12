import { Controller, Post } from '@nestjs/common'

import { ClientsBenchmarkService } from './clients-benchmark.service'

@Controller('clients-benchmark')
export class ClientsBenchmarkController {
  constructor(
    private readonly clientsBenchmarkService: ClientsBenchmarkService
  ) {}

  @Post('start')
  async start() {
    await this.clientsBenchmarkService.initNodes()
    const data = await this.clientsBenchmarkService.start()
    await this.clientsBenchmarkService.clean()

    return data
  }
}
