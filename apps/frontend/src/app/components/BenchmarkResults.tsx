import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import axios from 'axios'
import React from 'react'

import Chart from './Chart'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: theme.spacing(4),
    },
  })
)

interface Props {
  stopCallback: () => void
}

const BenchmarkPage: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { stopCallback } = props
  const [perfsData, setPerfsData] = React.useState([])

  React.useEffect(function initPerfsEventSource() {
    const perfsEventSource = new EventSource('/api/perfs')
    perfsEventSource.onmessage = event => {
      const data = JSON.parse(event.data)
      setPerfsData(data)
    }

    return function cleanup() {
      setPerfsData([])
    }
  }, [])

  const handleStop = () => {
    axios.post('/api/perfs/stop').then(() => {
      stopCallback()
    })
  }

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={handleStop}>
        Stop
      </Button>
      <div className={classes.flexContainer}>
        <div>
          <Chip label="write" />
          <Chart
            data={
              perfsData.length
                ? perfsData.map((datum, index) => ({
                    x: index + 1,
                    y: Math.round(datum.write),
                  }))
                : []
            }
          />
        </div>
        <div>
          <Chip label="read" />
          <Chart
            data={
              perfsData.length
                ? perfsData.map((datum, index) => ({
                    x: index + 1,
                    y: Math.round(datum.read),
                  }))
                : []
            }
          />
        </div>
      </div>
    </>
  )
}

export default BenchmarkPage
