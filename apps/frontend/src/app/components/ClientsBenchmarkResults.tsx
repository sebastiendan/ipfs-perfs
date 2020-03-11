import { makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import axios from 'axios'
import React from 'react'

import { ClientBenchmark } from '@ipfs-perfs/models'
import { assignCancelToken, cancelEffectCleaning } from '../../config'
import Chart from './Chart'

let cancelRequest

const useStyles = makeStyles((theme: Theme) => ({
  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing(4),
  },
}))

interface Props {
  isColorBlind: boolean
  stopCallback: () => void
}

const ClientsBenchmarkPage: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { isColorBlind, stopCallback } = props
  const [writeData, setWriteData] = React.useState([])
  const [readData, setReadData] = React.useState([])
  let eventSource

  React.useEffect(() => {
    return cancelEffectCleaning(cancelRequest)
  }, [])

  React.useEffect(function initPerfsEventSource() {
    eventSource = new EventSource('/api/clients-benchmark/results')
    eventSource.onmessage = event => {
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
      eventSource.close()
      setWriteData([])
      setReadData([])
    }
  }, [])

  const handleStop = () => {
    axios
      .post('/api/clients-benchmark/stop', undefined, {
        cancelToken: assignCancelToken(cancelRequest),
      })
      .then(() => {
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
          <Chart data={writeData} isColorBlind={isColorBlind} />
        </div>
        <div>
          <Chip label="read" />
          <Chart data={readData} isColorBlind={isColorBlind} />
        </div>
      </div>
    </>
  )
}

export default ClientsBenchmarkPage
