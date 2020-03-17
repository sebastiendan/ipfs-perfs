import Typography from '@material-ui/core/Typography'
import React from 'react'
import {
  createContainer,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryTooltip,
  VictoryStack,
  VictoryTheme,
  VictoryLabel,
} from 'victory'

import { ClientBenchmark } from '@ipfs-perfs/models'

interface Props {
  data: ClientBenchmark.Datum[]
}

const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi') as any

const Chart: React.FC<Props> = (props: Props) => {
  const { data } = props

  return (
    <div>
      <VictoryChart
        width={1200}
        height={600}
        domainPadding={{ x: 50, y: [0, 50] }}
        singleQuadrantDomainPadding={{ x: false }}
        theme={VictoryTheme.material}
        padding={{ left: 80, top: 50, bottom: 50, right: 50 }}
        containerComponent={
          <VictoryZoomVoronoiContainer
            labels={({ datum }) => `${datum.y.toFixed(2)}ms`}
            labelComponent={<VictoryTooltip style={{ fill: 'black' }} />}
          />
        }
      >
        <VictoryAxis
          axisLabelComponent={
            <VictoryLabel dy={30} style={{ fill: 'white' }} />
          }
          label="Buffer size"
          style={{ grid: { stroke: '#202a30' } }}
          tickFormat={x =>
            data[x - 1]
              ? data[x - 1].bufferSizeInKB < 1000
                ? `${data[x - 1].bufferSizeInKB}kB`
                : `${data[x - 1].bufferSizeInKB / 1000}MB`
              : ''
          }
        />
        <VictoryAxis
          axisLabelComponent={
            <VictoryLabel dy={-60} style={{ fill: 'white' }} />
          }
          dependentAxis
          label="Latency"
          style={{ grid: { stroke: '#202a30' } }}
          tickFormat={x => `${x}ms`}
        />
        <VictoryGroup
          offset={20}
          style={{
            data: { width: 15 },
            labels: { fill: 'white' },
          }}
        >
          <VictoryStack colorScale="red" labels={() => 'api'}>
            <VictoryBar
              data={data.map((datum, index) => ({
                x: index + 1,
                y: datum.api.write,
              }))}
            />
            <VictoryBar
              data={data.map((datum, index) => ({
                x: index + 1,
                y: datum.api.read,
              }))}
            />
          </VictoryStack>
          <VictoryStack colorScale="blue" labels={() => 'go'}>
            <VictoryBar
              data={data.map((datum, index) => ({
                x: index + 1,
                y: datum.go.write,
              }))}
            />
            <VictoryBar
              data={data.map((datum, index) => ({
                x: index + 1,
                y: datum.go.read,
              }))}
            />
          </VictoryStack>
          <VictoryStack colorScale="heatmap" labels={() => 'gateway'}>
            <VictoryBar
              data={data.map((datum, index) => ({
                x: index + 1,
                y: datum.api.write,
              }))}
            />
            <VictoryBar
              data={data.map((datum, index) => ({
                x: index + 1,
                y: datum.gateway.read,
              }))}
            />
          </VictoryStack>
        </VictoryGroup>
      </VictoryChart>
      <br />
      <Typography color="textSecondary" variant="body2">
        Note: Each bar is stacked with <b>write</b> latency below and{' '}
        <b>read</b> latency above (data is firstly written then read)
      </Typography>
    </div>
  )
}

export default Chart
