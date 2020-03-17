import { Controller, Post } from '@nestjs/common'

import { NodeApiService } from './node-api.service'

@Controller('node-api')
export class NodeApiController {
  constructor(private readonly nodeApiService: NodeApiService) {}

  @Post('start')
  async start() {
    await this.nodeApiService.initNode()
    const data = await this.nodeApiService.start()
    await this.nodeApiService.clean()

    return data
  }
}
