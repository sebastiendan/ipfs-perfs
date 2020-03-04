import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

import {
  VictoryAxis,
  VictoryChart,
  VictoryVoronoiContainer,
  VictoryLine,
  VictoryTheme,
} from 'victory'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      // maxHeight: 200,
    },
  })
)

interface Props {
  data: any
}

const Chart: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { data } = props

  return (
    <div className={classes.root}>
      <VictoryChart
        theme={VictoryTheme.material}
        padding={{ left: 80, top: 50, bottom: 50, right: 50 }}
        width={500}
        containerComponent={
          <VictoryVoronoiContainer labels={({ datum }) => `${datum.y}ms`} />
        }
      >
        <VictoryAxis />
        <VictoryAxis dependentAxis tickFormat={x => `${x}ms`} />
        <VictoryLine
          data={data}
          style={{
            data: { stroke: '#c43a31' },
            parent: { border: '1px solid #ccc' },
          }}
        />
      </VictoryChart>
    </div>
  )
}

export default Chart
