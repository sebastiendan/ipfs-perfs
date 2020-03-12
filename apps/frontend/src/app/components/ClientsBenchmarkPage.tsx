import { makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import React from 'react'

import { assignCancelToken, cancelEffectCleaning } from '../../config'
import Chart from './Chart'

let cancelRequest

const useStyles = makeStyles((theme: Theme) => ({
  loader: {
    marginRight: theme.spacing(1.5),
    opacity: 0.5,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2.5),
  },
}))

const ClientsBenchmarkPage: React.FC = () => {
  const classes = useStyles()
  const [data, setData] = React.useState([
    {
      api: { read: 47.048269, write: 80.48034299999999 },
      bufferSizeInKB: 10,
      gateway: { read: 11.953477 },
      go: { read: 55.951378, write: 136.59669399999999 },
      js: { read: 0, write: 0 },
    },
    {
      api: { read: 54.960708999999994, write: 11.526988999999999 },
      bufferSizeInKB: 100,
      gateway: { read: 44.686175999999996 },
      go: { read: 44.688106999999995, write: 220.78663999999998 },
      js: { read: 0, write: 0 },
    },
    {
      api: { read: 111.73563399999999, write: 33.936273 },
      bufferSizeInKB: 1000,
      gateway: { read: 116.410641 },
      go: { read: 79.632943, write: 283.292604 },
      js: { read: 0, write: 0 },
    },
    {
      api: { read: 64.95985399999999, write: 317.31741999999997 },
      bufferSizeInKB: 5000,
      gateway: { read: 478.240207 },
      go: { read: 101.520017, write: 353.763305 },
      js: { read: 0, write: 0 },
    },
    {
      api: { read: 225.501102, write: 414.48362599999996 },
      bufferSizeInKB: 10000,
      gateway: { read: 649.399016 },
      go: { read: 254.466559, write: 438.483203 },
      js: { read: 0, write: 0 },
    },
  ])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    return cancelEffectCleaning(cancelRequest)
  }, [])

  const handleStart = () => {
    setData(undefined)
    setIsLoading(true)

    axios
      .post('/api/clients-benchmark/start', {
        cancelToken: assignCancelToken(cancelRequest),
      })
      .then(res => setData(res.data))
      .catch()
      .then(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className={classes.root}>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleStart}
        disabled={isLoading}
      >
        {isLoading && <CircularProgress className={classes.loader} size={22} />}
        Start
      </Button>
      {data && <Chart data={data} />}
    </div>
  )
}

export default ClientsBenchmarkPage
