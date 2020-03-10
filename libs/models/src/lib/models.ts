export type Coordinate = { x: number; y: number }

export interface Datum {
  apiRead: number
  apiWrite: number
  gatewayRead: number
  goRead: number
  goWrite: number
  jsRead: number
  jsWrite: number
}

export interface NormalizedData {
  apiRead: Coordinate[]
  apiWrite: Coordinate[]
  gatewayRead: Coordinate[]
  goRead: Coordinate[]
  goWrite: Coordinate[]
  jsRead: Coordinate[]
  jsWrite: Coordinate[]
}
