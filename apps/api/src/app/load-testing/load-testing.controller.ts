import { Body, Controller, Get, Post, Res } from '@nestjs/common'

import { LoadTesting } from '@ipfs-perfs/models'
import { LoadTestingService } from './load-testing.service'
import { ReadSubject, WriteSubect } from './Subject.singleton'

@Controller('load-testing')
export class LoadTestingController {
  constructor(private readonly networkBenchmarkService: LoadTestingService) {}

  @Get('write/results')
  getWriteResults(@Res() res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    WriteSubect.subscribe(data => {
      res.write(`data: ${JSON.stringify(data)}\n\n`)
    })
  }

  @Get('read/results')
  getReadResults(@Res() res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    ReadSubject.subscribe(data => {
      res.write(`data: ${JSON.stringify(data)}\n\n`)
    })
  }

  @Post('write/start')
  async startWrite(@Body() dto: LoadTesting.StartDto) {
    await this.networkBenchmarkService.initNode()
    await this.networkBenchmarkService.startWrite(dto)
  }

  @Post('read/start')
  async startRead(@Body() dto: LoadTesting.StartDto) {
    await this.networkBenchmarkService.initNode()
    await this.networkBenchmarkService.startRead(dto)
  }
}
