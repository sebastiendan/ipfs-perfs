import { Body, Controller, Get, Post, Res } from '@nestjs/common'

import { NormalizedData } from '@ipfs-perfs/models'
import { AppService } from './app.service'
import Subject from './Subject.singleton'

@Controller('perfs')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPerfs(@Res() res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    Subject.subscribe((data: NormalizedData) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`)
    })
  }

  @Post('start')
  async start(@Body() data: { bufferSize: number }) {
    const { bufferSize } = data
    await this.appService.initNodes()
    await this.appService.startSyncQueue(bufferSize)
  }

  @Post('stop')
  stop() {
    return this.appService.stopSyncQueue()
  }
}
