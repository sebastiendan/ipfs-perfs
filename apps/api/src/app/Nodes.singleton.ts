import * as os from 'os'
import { join } from 'path'

import Node from './Node'

const nodeA = Node.createFromOptions({
  repo: join(os.tmpdir(), 'jsipfs-' + Math.random()),
  config: {
    Addresses: {
      Swarm: ['/ip4/0.0.0.0/tcp/4001', '/ip4/127.0.0.1/tcp/4002/ws'],
      API: '/ip4/127.0.0.1/tcp/5001',
      Gateway: '/ip4/127.0.0.1/tcp/8080',
    },
    Bootstrap: [],
  },
})

const nodeB = Node.createFromOptions({
  repo: join(os.tmpdir(), 'jsipfs-' + Math.random()),
  config: {
    Addresses: {
      Swarm: ['/ip4/0.0.0.0/tcp/4003', '/ip4/127.0.0.1/tcp/4004/ws'],
      API: '/ip4/127.0.0.1/tcp/5002',
      Gateway: '/ip4/127.0.0.1/tcp/8081',
    },
    Bootstrap: [],
  },
})

export { nodeA, nodeB }
