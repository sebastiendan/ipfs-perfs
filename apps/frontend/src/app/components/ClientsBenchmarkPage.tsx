import { makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import React from 'react'

import { assignCancelToken, cancelEffectCleaning } from '../../config'
import Chart from './ClientsBenchmarkChart'

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
  const [data, setData] = React.useState()
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
