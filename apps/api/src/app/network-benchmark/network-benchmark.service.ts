import { Injectable } from '@nestjs/common'
import autocannon from 'autocannon'
import ipfsdCTL from 'ipfsd-ctl'
import ipfsHttpModule from 'ipfs-http-client'
import * as os from 'os'
import { join } from 'path'
import * as last from 'it-last'

import { NetworkBenchmark } from '@ipfs-perfs/models'
import { buildBuffer } from '@ipfs-perfs/utils'
import SSESubject from './Subject.singleton'

@Injectable()
export class NetworkBenchmarkService {
  private node
  private instance
  private data = []

  public async initNode() {
    this.node = await ipfsdCTL.createController({
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
            Swarm: ['/ip4/0.0.0.0/tcp/4001', '/ip4/127.0.0.1/tcp/4002/ws'],
            API: '/ip4/127.0.0.1/tcp/5001',
            Gateway: '/ip4/127.0.0.1/tcp/8080',
          },
        },
      },
      ipfsHttpModule,
    })
  }

  public async start(dto: NetworkBenchmark.StartBenchmarkDto) {
    const buffer = buildBuffer(10)
    const file = await last(this.node.api.add(buffer))

    this.instance = autocannon(
      {
        url: `http://localhost:5001/api/v0/get?arg=${file.cid.toString()}`,
        connections: +dto.numberOfConnections || 10,
        duration: +dto.durationInSeconds || 10,
        pipelining: 1,
      },
      this.handleDone.bind(this)
    )

    process.once('SIGINT', () => {
      console.info('\nStopping gracefully...')
      this.instance.stop()
    })

    this.instance.on('response', this.handleResponse.bind(this))

    return new Promise(resolve => {
      this.instance.on('done', resolve)
    })
  }

  public stop() {
    if (this.instance) {
      this.instance.stop()
    }

    this.node.stop()
  }

  private handleResponse(client, statusCode, resBytes, responseTime) {
    console.log(
      `Got response with code ${statusCode} in ${responseTime} milliseconds`
    )
    console.log(`response: ${resBytes.toString()}`)
  }

  private handleDone(error, results) {
    this.data = results
    this.propagateUpdate()
    this.stop()
  }

  propagateUpdate() {
    SSESubject.next(this.data)
  }
}
