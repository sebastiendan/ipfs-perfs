export namespace ClientBenchmark {
  export type Coordinate = { x: number; y: number }

  export interface Perf {
    read: number
    write?: number
  }

  export interface Datum {
    api: Perf
    bufferSizeInKB: number
    gateway: Perf
    go: Perf
    js: Perf
  }
}

export namespace LoadTesting {
  export type OperationTypes = 'read' | 'write'

  export class StartDto {
    durationInSeconds: string
    bufferSizeInKB: number
  }
}
