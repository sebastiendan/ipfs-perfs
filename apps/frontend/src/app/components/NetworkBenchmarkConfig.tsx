import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import axios from 'axios'
import React from 'react'

interface Props {
  startCallback: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loader: {
      marginRight: theme.spacing(1.5),
      opacity: 0.5,
    },
    title: {
      marginBottom: theme.spacing(4.5),
    },
  })
)

function valuetext(value: number) {
  return `${value}kB`
}

const marks = [
  { value: 10, label: '10kB' },
  { value: 1000, label: '1MB' },
  { value: 10000, label: '10MB' },
]

const NetworkBenchmarkConfig: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { startCallback } = props
  const [numberOfConnections, setNumberOfConnections] = React.useState(10)
  const [durationInSeconds, setDurationInSeconds] = React.useState(10)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleStart = () => {
    setIsLoading(true)

    axios
      .post('/api/perfs/start', { numberOfConnections, durationInSeconds })
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
      case 'duration':
        stateCallback = setDurationInSeconds
        break
    }

    if (stateCallback) {
      stateCallback(e.target.value)
    }
  }

  return (
    <>
      <Typography className={classes.title}>Buffer size (kB)</Typography>
      <TextField />
      <Button
        variant="outlined"
        color="primary"
        onClick={handleStart}
        disabled={isLoading}
      >
        {isLoading && <CircularProgress className={classes.loader} size={22} />}
        Start
      </Button>
    </>
  )
}

export default NetworkBenchmarkConfig
