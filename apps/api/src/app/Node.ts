import * as IPFS from 'ipfs'
import * as last from 'it-last'
const concat = require('it-concat')

export default class Node {
  public static createFromOptions(options: Object) {
    return new Node(options)
  }

  private _node
  private options

  private constructor(options: Object) {
    this.options = options
  }

  public async init() {
    this._node = await IPFS.create(this.options)
  }

  public async dial(multiaddr) {
    return this._node.swarm.connect(multiaddr)
  }

  public async id() {
    return this._node.id()
  }

  public async peers() {
    return this._node.swarm.peers()
  }

  public async add(data: string | Buffer) {
    return last(this._node.add(data, {
      preload: false,
      pin: false
    }))
  }

  public async get(hash: string) {
    for await (const file of this._node.get(hash, { preload: false })) {
      console.log(file.path)

      const content = []

      for await (const chunk of file.content) {
        console.log('chunk:\n', chunk.length)
        content.push(chunk.length)
      }

      console.log('content:', content.reduce((prev, curr) => prev + curr))
    }

    return
    // const output = await all(this._node.get(hash))
    // const content = await concat(output[0].content)

    // return content
  }
}
