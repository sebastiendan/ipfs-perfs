import { Body, Controller, Get, Post, Res } from '@nestjs/common'

import { AppService } from './app.service'
import Subject from './Subject.singleton'

@Controller('perfs')
export class AppController {
  constructor(private readonly appService: AppService) {
    this.appService.initTransfer()
  }

  @Get()
  getPerfs(@Res() res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    Subject.subscribe(value => {
      res.write(`data: ${JSON.stringify(value)}\n\n`)
    })
  }

  @Post('start')
  async start(@Body() data: { bufferSize: number }) {
    const { bufferSize } = data
    this.appService.startSyncQueue(bufferSize)
  }

  @Post('stop')
  stop() {
    this.appService.stopSyncQueue()
  }
}
