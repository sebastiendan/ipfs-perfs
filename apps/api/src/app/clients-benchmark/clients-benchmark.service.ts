import { Injectable } from '@nestjs/common'
import axios from 'axios'
import * as FormData from 'form-data'
import ipfsdCTL from 'ipfsd-ctl'
import ipfsHttpModule from 'ipfs-http-client'
import * as os from 'os'
import { join } from 'path'
import { Subject, Observable, Subscription } from 'rxjs'
const perf = require('execution-time')()
import * as last from 'it-last'

import { ClientBenchmark } from '@ipfs-perfs/models'
import { buildBuffer } from '@ipfs-perfs/utils'

@Injectable()
export class ClientsBenchmarkService {
  private apiWrite
  private apiRead
  private gatewayRead
  private goWrite
  private goRead
  private jsWrite
  private jsRead
  private data: ClientBenchmark.Datum[] = []

  public async initNodes() {
    this.jsWrite = await ipfsdCTL.createController({
      type: 'js',
      ipfsBin: join(
        __dirname,
        '..',
        '..',
        '..',
        'node_modules/ipfs/src/cli/bin.js'
      ),
      ipfsOptions: {
        repo: join(os.tmpdir(), 'jsipfs-' + Math.random()),
        config: {
          Addresses: {
            Swarm: ['/ip4/0.0.0.0/tcp/4001', '/ip4/127.0.0.1/tcp/4002/ws'],
            API: '/ip4/127.0.0.1/tcp/5001',
            Gateway: '/ip4/127.0.0.1/tcp/8080',
          },
        },
      },
      ipfsHttpModule,
    })

    this.jsRead = await ipfsdCTL.createController({
      type: 'js',
      ipfsBin: join(
        __dirname,
        '..',
        '..',
        '..',
        'node_modules/ipfs/src/cli/bin.js'
      ),
      ipfsOptions: {
        repo: join(os.tmpdir(), 'jsipfs-' + Math.random()),
        config: {
          Addresses: {
            Swarm: ['/ip4/0.0.0.0/tcp/4003', '/ip4/127.0.0.1/tcp/4004/ws'],
            API: '/ip4/127.0.0.1/tcp/5002',
            Gateway: '/ip4/127.0.0.1/tcp/8081',
          },
        },
      },
      ipfsHttpModule,
    })

    this.goWrite = await ipfsdCTL.createController({
      type: 'go',
      ipfsBin: join(
        __dirname,
        '..',
        '..',
        '..',
        'node_modules/go-ipfs-dep/go-ipfs/ipfs'
      ),
      ipfsOptions: {
        repo: join(os.tmpdir(), 'goipfs-' + Math.random()),
        config: {
          Addresses: {
            Swarm: ['/ip4/0.0.0.0/tcp/4005', '/ip4/127.0.0.1/tcp/4006/ws'],
            API: '/ip4/127.0.0.1/tcp/5003',
            Gateway: '/ip4/127.0.0.1/tcp/8082',
          },
        },
      },
      ipfsHttpModule,
    })

    this.goRead = await ipfsdCTL.createController({
      type: 'go',
      ipfsBin: join(
        __dirname,
        '..',
        '..',
        '..',
        'node_modules/go-ipfs-dep/go-ipfs/ipfs'
      ),
      ipfsOptions: {
        repo: join(os.tmpdir(), 'goipfs-' + Math.random()),
        config: {
          Addresses: {
            Swarm: ['/ip4/0.0.0.0/tcp/4007', '/ip4/127.0.0.1/tcp/4008/ws'],
            API: '/ip4/127.0.0.1/tcp/5004',
            Gateway: '/ip4/127.0.0.1/tcp/8083',
          },
        },
      },
      ipfsHttpModule,
    })

    this.apiWrite = await ipfsdCTL.createController({
      type: 'go',
      ipfsBin: join(
        __dirname,
        '..',
        '..',
        '..',
        'node_modules/go-ipfs-dep/go-ipfs/ipfs'
      ),
      ipfsOptions: {
        repo: join(os.tmpdir(), 'goipfs-' + Math.random()),
        config: {
          Addresses: {
            Swarm: ['/ip4/0.0.0.0/tcp/4009', '/ip4/127.0.0.1/tcp/4010/ws'],
            API: '/ip4/127.0.0.1/tcp/5005',
            Gateway: '/ip4/127.0.0.1/tcp/8084',
          },
        },
      },
      ipfsHttpModule,
    })

    this.apiRead = await ipfsdCTL.createController({
      type: 'go',
      ipfsBin: join(
        __dirname,
        '..',
        '..',
        '..',
        'node_modules/go-ipfs-dep/go-ipfs/ipfs'
      ),
      ipfsOptions: {
        repo: join(os.tmpdir(), 'goipfs-' + Math.random()),
        config: {
          Addresses: {
            Swarm: ['/ip4/0.0.0.0/tcp/4011', '/ip4/127.0.0.1/tcp/4012/ws'],
            API: '/ip4/127.0.0.1/tcp/5006',
            Gateway: '/ip4/127.0.0.1/tcp/8085',
          },
        },
      },
      ipfsHttpModule,
    })

    this.gatewayRead = await ipfsdCTL.createController({
      type: 'go',
      ipfsBin: join(
        __dirname,
        '..',
        '..',
        '..',
        'node_modules/go-ipfs-dep/go-ipfs/ipfs'
      ),
      ipfsOptions: {
        repo: join(os.tmpdir(), 'goipfs-' + Math.random()),
        config: {
          Addresses: {
            Swarm: ['/ip4/0.0.0.0/tcp/4013', '/ip4/127.0.0.1/tcp/4014/ws'],
            API: '/ip4/127.0.0.1/tcp/5007',
            Gateway: '/ip4/127.0.0.1/tcp/8086',
          },
        },
      },
      ipfsHttpModule,
    })
  }

  public start() {
    return Promise.all([
      this.writeReadAndGetPerfs(10),
      this.writeReadAndGetPerfs(100),
      this.writeReadAndGetPerfs(1000),
      this.writeReadAndGetPerfs(5000),
      this.writeReadAndGetPerfs(10000),
    ])
  }

  private async writeReadAndGetPerfs(
    bufferSizeInKB: number = 10
  ): Promise<ClientBenchmark.Datum> {
    // const js = await this.writeReadAndGetPerfsJS(bufferSizeInKB)
    const go = await this.writeReadAndGetPerfsGo(bufferSizeInKB)
    const api = await this.writeReadAndGetPerfsAPI(bufferSizeInKB)
    const gateway = await this.writeReadAndGetPerfsGateway(bufferSizeInKB)

    return {
      api,
      bufferSizeInKB,
      gateway,
      go,
      js: { read: 0, write: 0 },
      // js,
    }
  }

  private async writeReadAndGetPerfsJS(
    bufferSizeInKB: number
  ): Promise<ClientBenchmark.Perf> {
    const buffer = buildBuffer(bufferSizeInKB)

    perf.start('js-write')
    const jsFile = await last(this.jsWrite.api.add(buffer))
    const writePerf = perf.stop('js-write')

    console.log('hash:\n', jsFile.cid.toString())

    perf.start('js-read')
    for await (const file of this.jsRead.api.get(jsFile.cid, {
      preload: false,
    })) {
      const content = []

      for await (const chunk of file.content) {
        content.push(chunk.length)
      }
    }
    const readPerf = perf.stop('js-read')

    return { read: readPerf.time, write: writePerf.time }
  }

  private async writeReadAndGetPerfsGo(
    bufferSizeInKB: number
  ): Promise<ClientBenchmark.Perf> {
    const buffer = buildBuffer(bufferSizeInKB)

    perf.start('go-write')
    const goFile = await last(this.goWrite.api.add(buffer))
    const writePerf = perf.stop('go-write')

    perf.start('go-read')
    for await (const file of this.goRead.api.get(goFile.cid, {
      preload: false,
    })) {
      const content = []

      for await (const chunk of file.content) {
        content.push(chunk.length)
      }
    }
    const readPerf = perf.stop('go-read')

    return { read: readPerf.time, write: writePerf.time }
  }

  private async writeReadAndGetPerfsAPI(
    bufferSizeInKB: number
  ): Promise<ClientBenchmark.Perf> {
    const buffer = buildBuffer(bufferSizeInKB)

    perf.start('api-write')
    const formData = new FormData()
    formData.append('file', buffer)
    const apiFile = await axios.post(
      `http://localhost:5005/api/v0/add`,
      formData.getBuffer(),
      {
        headers: formData.getHeaders(),
      }
    )
    const writePerf = perf.stop('api-write')

    perf.start('api-read')
    await axios.get(`http://localhost:5006/api/v0/get?arg=${apiFile.data.Hash}`)
    const readPerf = perf.stop('api-read')

    return { read: readPerf.time, write: writePerf.time }
  }

  private async writeReadAndGetPerfsGateway(
    bufferSizeInKB: number
  ): Promise<ClientBenchmark.Perf> {
    const buffer = buildBuffer(bufferSizeInKB)
    const goFile = await last(this.goWrite.api.add(buffer))

    perf.start('gateway-read')
    await axios.get(`http://localhost:8086/ipfs/${goFile.cid.toString()}`)
    const readPerf = perf.stop('api-read')

    return { read: readPerf.time }
  }

  public async clean() {
    await Promise.all(
      [
        this.jsWrite,
        this.jsRead,
        this.goWrite,
        this.goRead,
        this.apiRead,
        this.apiWrite,
        this.gatewayRead,
      ].map(node => node.stop())
    )
  }
}
