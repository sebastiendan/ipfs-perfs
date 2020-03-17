import { Injectable } from '@nestjs/common'
import axios from 'axios'
import * as FormData from 'form-data'
import ipfsdCTL from 'ipfsd-ctl'
import ipfsHttpModule from 'ipfs-http-client'
import * as os from 'os'
import { join } from 'path'
const perf = require('execution-time')()

import { NodeAPI } from '@ipfs-perfs/models'
import { buildBuffer } from '@ipfs-perfs/utils'

@Injectable()
export class NodeApiService {
  private writeNode
  private readNode

  public async initNode() {
    this.writeNode = await ipfsdCTL.createController({
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

    this.readNode = await ipfsdCTL.createController({
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
            Swarm: ['/ip4/0.0.0.0/tcp/4003', '/ip4/127.0.0.1/tcp/4004/ws'],
            API: '/ip4/127.0.0.1/tcp/5002',
            Gateway: '/ip4/127.0.0.1/tcp/8081',
          },
        },
      },
      ipfsHttpModule,
    })
  }

  public async start() {
    const data = []

    for (const bufferSizeInKB of [10, 100, 1000, 5000, 10000, 100000]) {
      data.push(await this.handleBufferOfSizeInKB(bufferSizeInKB))
    }

    return data
  }

  private async handleBufferOfSizeInKB(
    bufferSizeInKB: number
  ): Promise<NodeAPI.Datum> {
    const readData = []
    const writeData = []

    for (let i = 0; i < 10; i++) {
      const { read, write } = await this.writeReadAndGetPerfs(bufferSizeInKB)
      readData.push(read)
      writeData.push(write)
    }

    const datum: NodeAPI.Datum = {
      bufferSizeInKB,
      read: this.getResultFromPerfs(readData),
      write: this.getResultFromPerfs(writeData),
    }

    return datum
  }

  private getResultFromPerfs(data: number[]) {
    const average = data.reduce((acc, curr) => acc + curr) / data.length

    const result: NodeAPI.Result = {
      average,
      max: Math.max(...data),
      min: Math.min(...data),
      stddev: Math.sqrt(
        data
          .map(datum => Math.pow(datum - average, 2))
          .reduce((acc, curr) => acc + curr) / data.length
      ),
    }

    return result
  }

  private async writeReadAndGetPerfs(
    bufferSizeInKB: number
  ): Promise<NodeAPI.Perf> {
    const buffer = buildBuffer(bufferSizeInKB)

    perf.start('write')
    const formData = new FormData()
    formData.append('file', buffer)
    const apiFile = await axios.post(
      `http://localhost:5001/api/v0/add`,
      formData.getBuffer(),
      {
        headers: formData.getHeaders(),
        maxContentLength: Infinity,
      }
    )

    const writePerf = perf.stop('write')

    perf.start('read')
    await axios.get(`http://localhost:5002/api/v0/get?arg=${apiFile.data.Hash}`)
    const readPerf = perf.stop('read')

    return { read: readPerf.time, write: writePerf.time }
  }

  public async clean() {
    await this.writeNode.stop()
    await this.readNode.stop()
  }
}
