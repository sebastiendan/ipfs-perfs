import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import axios from 'axios'
import React from 'react'

import { ClientBenchmark } from '@ipfs-perfs/models'
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

const ClientsBenchmarkPage: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { stopCallback } = props
  const [writeData, setWriteData] = React.useState([])
  const [readData, setReadData] = React.useState([])

  React.useEffect(function initPerfsEventSource() {
    const perfsEventSource = new EventSource('/api/clients-benchmark/results')
    perfsEventSource.onmessage = event => {
      const {
        apiRead,
        apiWrite,
        gatewayRead,
        jsRead,
        jsWrite,
        goRead,
        goWrite,
      }: ClientBenchmark.NormalizedData = JSON.parse(event.data)

      setWriteData([
        { data: apiWrite, title: 'http-api' },
        { data: jsWrite, title: 'js-ipfs' },
        { data: goWrite, title: 'go-ipfs' },
      ])
      setReadData([
        { data: apiRead, title: 'http-api' },
        { data: jsRead, title: 'js-ipfs' },
        { data: goRead, title: 'go-ipfs' },
        { data: gatewayRead, title: 'gateway' },
      ])
    }

    return function cleanup() {
      setWriteData([])
      setReadData([])
    }
  }, [])

  const handleStop = () => {
    axios.post('/api/clients-benchmark/stop').then(() => {
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
          <Chart data={writeData} />
        </div>
        <div>
          <Chip label="read" />
          <Chart data={readData} />
        </div>
      </div>
    </>
  )
}

export default ClientsBenchmarkPage
