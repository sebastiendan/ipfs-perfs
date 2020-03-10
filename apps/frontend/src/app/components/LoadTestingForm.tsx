import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'
import React from 'react'

import { NetworkBenchmark } from '@ipfs-perfs/models'

interface Props {
  disabled: boolean
  startCallback: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    loader: {
      marginRight: theme.spacing(1.5),
      opacity: 0.5,
    },
  })
)

const NetworkBenchmarkConfig: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { disabled, startCallback } = props
  const [numberOfConnections, setNumberOfConnections] = React.useState('10')
  const [durationInSeconds, setDurationInSeconds] = React.useState('10')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleStart = () => {
    setIsLoading(true)
    const data: NetworkBenchmark.StartBenchmarkDto = {
      durationInSeconds,
      numberOfConnections,
    }

    axios
      .post('/api/network-benchmark/start', data)
      .then(() => {
        startCallback()
      })
      .then(() => {
        setIsLoading(false)
      })
  }

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let stateCallback

    switch (field) {
      case 'numberOfConnections':
        stateCallback = setNumberOfConnections
        break
      case 'durationInSeconds':
        stateCallback = setDurationInSeconds
        break
    }

    if (stateCallback && !isNaN(+e.target.value)) {
      stateCallback(e.target.value)
    }
  }

  return (
    <>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField
          id="number-of-connections"
          disabled={isLoading || disabled}
          label="Number of connections"
          onChange={handleChange('numberOfConnections')}
          type="number"
          variant="outlined"
          value={numberOfConnections}
        />
        <TextField
          id="duration-in-seconds"
          disabled={isLoading || disabled}
          label="Duration in seconds"
          onChange={handleChange('durationInSeconds')}
          type="number"
          variant="outlined"
          value={durationInSeconds}
        />
      </form>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleStart}
        disabled={isLoading || disabled}
      >
        {isLoading && <CircularProgress className={classes.loader} size={22} />}
        Start
      </Button>
    </>
  )
}

export default NetworkBenchmarkConfig
