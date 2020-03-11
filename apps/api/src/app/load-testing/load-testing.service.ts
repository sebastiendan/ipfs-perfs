import { Injectable } from '@nestjs/common'
import autocannon from 'autocannon'
import * as FormData from 'form-data'
import ipfsdCTL from 'ipfsd-ctl'
import ipfsHttpModule from 'ipfs-http-client'
import * as os from 'os'
import { join } from 'path'
import * as last from 'it-last'

import { LoadTesting } from '@ipfs-perfs/models'
import { buildBuffer } from '@ipfs-perfs/utils'
import { ReadSubject, WriteSubect } from './Subject.singleton'

@Injectable()
export class LoadTestingService {
  private node
  private readInstance
  private writeInstance

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

  public async startWrite(dto: LoadTesting.StartDto) {
    const buffer = buildBuffer(dto.bufferSizeInKB || 10)
    const formData = new FormData()
    formData.append('file', buffer)

    this.writeInstance = autocannon(
      {
        url: `http://localhost:5001/api/v0/add`,
        method: 'POST',
        body: formData.getBuffer(),
        headers: formData.getHeaders(),
        connections: 10,
        duration: +dto.durationInSeconds || 10,
        pipelining: 1,
      },
      this.handleDone.bind(this, 'write')
    )

    this.writeInstance.on('response', this.handleResponse.bind(this))

    return new Promise(resolve => {
      this.writeInstance.on('done', resolve)
    })
  }

  public async startRead(dto: LoadTesting.StartDto) {
    const buffer = buildBuffer(dto.bufferSizeInKB || 10)
    const file = await last(this.node.api.add(buffer))

    this.readInstance = autocannon(
      {
        url: `http://localhost:5001/api/v0/get?arg=${file.cid.toString()}`,
        connections: 10,
        duration: +dto.durationInSeconds || 10,
        pipelining: 1,
      },
      this.handleDone.bind(this, 'read')
    )

    this.readInstance.on('response', this.handleResponse.bind(this))

    return new Promise(resolve => {
      this.readInstance.on('done', resolve)
    })
  }

  public stop() {
    if (this.writeInstance) {
      this.writeInstance.stop()
    }

    if (this.readInstance) {
      this.readInstance.stop()
    }

    this.node.stop()
  }

  private handleResponse(client, statusCode, resBytes, responseTime) {
    console.log(
      `Got response with code ${statusCode} in ${responseTime} milliseconds`
    )
    console.log(`response: ${resBytes.toString()}`)
  }

  private handleDone(type: LoadTesting.OperationTypes, error, results) {
    this.propagateUpdate(results, type)
    this.stop()
  }

  propagateUpdate(data, type: LoadTesting.OperationTypes) {
    switch (type) {
      case 'read':
        ReadSubject.next(data)
        break
      case 'write':
        WriteSubect.next(data)
        break
    }
  }
}
