import { Subject } from 'rxjs'

import { ClientBenchmark } from '@ipfs-perfs/models'

export default new Subject<ClientBenchmark.NormalizedData>()
