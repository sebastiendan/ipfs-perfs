import React from 'react'
import {
  VictoryAxis,
  VictoryChart,
  VictoryLegend,
  VictoryScatter,
  VictoryTheme,
  VictoryVoronoiContainer,
} from 'victory'

import { Coordinate } from '@ipfs-perfs/models'

interface Props {
  data: { data: Coordinate[]; title: string }[]
}

const Chart: React.FC<Props> = (props: Props) => {
  const { data } = props
  const SETS = React.useMemo(
    () => [
      { color: '#c43a31', symbol: 'star' },
      { color: '#8cc151', symbol: 'square' },
      { color: 'gold', symbol: 'diamond' },
      { color: 'blue', symbol: 'circle' },
    ],
    []
  )

  return (
    <div>
      <VictoryChart
        theme={VictoryTheme.material}
        padding={{ left: 80, top: 50, bottom: 50, right: 50 }}
        width={500}
        containerComponent={
          <VictoryVoronoiContainer labels={({ datum }) => `${datum.y}ms`} />
        }
      >
        <VictoryLegend
          x={80}
          y={10}
          orientation="horizontal"
          gutter={10}
          style={{
            labels: { fill: 'white' },
          }}
          data={data.map((wrappedDatum, index) => ({
            name: wrappedDatum.title,
            symbol: { fill: SETS[index].color, type: SETS[index].symbol },
          }))}
        />
        <VictoryAxis />
        <VictoryAxis dependentAxis tickFormat={x => `${x}ms`} />
        {data.map((wrappedDatum, index) => (
          <VictoryScatter
            key={`${index}-${wrappedDatum.title}`}
            data={wrappedDatum.data.map(datum => ({
              ...datum,
              fill: SETS[index].color,
              symbol: SETS[index].symbol,
            }))}
            style={{
              data: {
                fill: SETS[index].color,
              },
            }}
          />
        ))}
      </VictoryChart>
    </div>
  )
}

export default Chart
