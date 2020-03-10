import { Body, Controller, Get, Post, Res } from '@nestjs/common'

import { NetworkBenchmark } from '@ipfs-perfs/models'
import { NetworkBenchmarkService } from './network-benchmark.service'
import Subject from './Subject.singleton'

@Controller('network-benchmark')
export class NetworkBenchmarkController {
  constructor(
    private readonly networkBenchmarkService: NetworkBenchmarkService
  ) {}

  @Get('results')
  getResults(@Res() res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    Subject.subscribe(data => {
      res.write(`data: ${JSON.stringify(data)}\n\n`)
    })
  }

  @Post('start')
  async start(@Body() dto: NetworkBenchmark.StartBenchmarkDto) {
    await this.networkBenchmarkService.initNode()
    await this.networkBenchmarkService.start(dto)
  }

  @Post('stop')
  stop() {
    return this.networkBenchmarkService.stop()
  }
}
