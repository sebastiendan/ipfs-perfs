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
import SSESubject from './Subject.singleton'

@Injectable()
export class ClientsBenchmarkService {
  private apiWrite
  private apiRead
  private gatewayRead
  private goWrite
  private goRead
  private jsWrite
  private jsRead
  private data = []
  private normalizedData: ClientBenchmark.NormalizedData
  private perfSubject: Subject<Observable<void>>
  private perfSubscription: Subscription

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

  public startSyncQueue(bufferSizeInKB: number) {
    this.perfSubject = new Subject()
    this.perfSubscription = this.perfSubject.subscribe({
      next: newPerf => {
        newPerf.subscribe({
          complete: this.triggerPerfs.bind(this, bufferSizeInKB),
        })
      },
    })

    this.triggerPerfs(bufferSizeInKB)
  }

  public async stopSyncQueue() {
    this.perfSubject.complete()
    this.perfSubscription.unsubscribe()
    this.data = []

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

  private triggerPerfs(bufferSizeInKB: number = 10): void {
    const newPerf = new Observable<void>(subscriber => {
      this.writeReadAndGetPerfs(bufferSizeInKB).then(
        (datum: ClientBenchmark.Datum) => {
          this.pushPerfData(datum)
          this.normalizeData()
          this.propagateUpdate()

          subscriber.complete()
        }
      )
    })

    this.perfSubject.next(newPerf)
  }

  private async writeReadAndGetPerfs(
    bufferSizeInKB: number = 10
  ): Promise<ClientBenchmark.Datum> {
    const buffer = buildBuffer(bufferSizeInKB)

    // perf.start('js-write')
    // const jsFile = await last(this.jsWrite.api.add(buffer))
    // const jsWritePerf = perf.stop('js-write')

    // console.log('hash:\n', jsFile.cid.toString())

    // perf.start('js-read')
    // for await (const file of this.jsRead.api.get(jsFile.cid, {
    //   preload: false,
    // })) {
    //   const content = []

    //   for await (const chunk of file.content) {
    //     content.push(chunk.length)
    //   }
    // }
    // const jsReadPerf = perf.stop('js-read')

    perf.start('go-write')
    const goFile = await last(this.goWrite.api.add(buffer))
    const goWritePerf = perf.stop('go-write')

    perf.start('go-read')
    for await (const file of this.goRead.api.get(goFile.cid, {
      preload: false,
    })) {
      const content = []

      for await (const chunk of file.content) {
        content.push(chunk.length)
      }
    }
    const goReadPerf = perf.stop('go-read')

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
    const apiWritePerf = perf.stop('api-write')

    perf.start('api-read')
    await axios.get(`http://localhost:5006/api/v0/get?arg=${apiFile.data.Hash}`)
    const apiReadPerf = perf.stop('api-read')

    perf.start('gateway-read')
    await axios.get(`http://localhost:8086/ipfs/${goFile.cid.toString()}`)
    const gatewayReadPerf = perf.stop('api-read')

    return {
      apiRead: apiReadPerf.time,
      apiWrite: apiWritePerf.time,
      gatewayRead: gatewayReadPerf.time,
      goRead: goReadPerf.time,
      goWrite: goWritePerf.time,
      jsWrite: 0,
      jsRead: 0,
      // jsWrite: jsWritePerf.time,
      // jsRead: jsReadPerf.time,
    }
  }

  pushPerfData(datum: ClientBenchmark.Datum) {
    this.data.push(datum)
  }

  normalizeData() {
    const hasDataOneElement = this.data.length

    try {
      if (!hasDataOneElement) {
        throw Error(
          'this.data is empty - Ensure that data was pushed before calling this method'
        )
      }

      const arbitraryDatum = this.data[0]
      const normalizedData = {} as ClientBenchmark.NormalizedData

      Object.keys(arbitraryDatum).forEach(datumKey => {
        if (arbitraryDatum.hasOwnProperty(datumKey)) {
          normalizedData[datumKey] = this.data.map(
            (datum: ClientBenchmark.Datum, index: number) => ({
              x: index + 1,
              y: datum[datumKey],
            })
          )
        }
      })

      this.normalizedData = normalizedData
    } catch (error) {
      console.error(error)
    }
  }

  propagateUpdate() {
    SSESubject.next(this.normalizedData)
  }
}
