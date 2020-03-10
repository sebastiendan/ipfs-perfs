import { Body, Controller, Get, Post, Res } from '@nestjs/common'

import { ClientBenchmark } from '@ipfs-perfs/models'
import { ClientsBenchmarkService } from './clients-benchmark.service'
import Subject from './Subject.singleton'

@Controller('clients-benchmark')
export class ClientsBenchmarkController {
  constructor(
    private readonly clientsBenchmarkService: ClientsBenchmarkService
  ) {}

  @Get('results')
  getResults(@Res() res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    Subject.subscribe((data: ClientBenchmark.NormalizedData) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`)
    })
  }

  @Post('start')
  async start(@Body() data: { bufferSize: number }) {
    const { bufferSize } = data
    await this.clientsBenchmarkService.initNodes()
    await this.clientsBenchmarkService.startSyncQueue(bufferSize)
  }

  @Post('stop')
  stop() {
    return this.clientsBenchmarkService.stopSyncQueue()
  }
}
