import * as IPFS from 'ipfs'
import * as all from 'it-all'
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

  public async add(data: string | Buffer) {
    return (await all(this._node.add(data)))[0]
  }

  public async get(hash: string) {
    for await (const file of this._node.get(hash)) {
      console.log(file.path)

      const content = []
      console.log('file content:\n', file.content)
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
