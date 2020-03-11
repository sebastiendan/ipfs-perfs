import { makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'
import React from 'react'

import { LoadTesting } from '@ipfs-perfs/models'
import { assignCancelToken, cancelEffectCleaning } from '../../config'
import BufferSizeSlider from './BufferSizeSlider'

let cancelRequest

interface Props {
  handleLoadTestingIsLoading: () => void
  handleLoadTestingIsNotLoading: () => void
  isFormDisabled: boolean
  isLoading: boolean
  startCallback: () => void
  type: 'read' | 'write'
}

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  flexContainer: {
    '& > *': {
      padding: theme.spacing(1),
    },
    display: 'flex',
    justifyContent: 'space-around',
  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  loader: {
    marginRight: theme.spacing(1.5),
    opacity: 0.5,
  },
}))

const NetworkBenchmarkConfig: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const {
    handleLoadTestingIsLoading,
    handleLoadTestingIsNotLoading,
    isFormDisabled,
    isLoading,
    startCallback,
    type,
  } = props
  const [bufferSizeInKB, setBufferSizeInKB] = React.useState(1000)
  const [durationInSeconds, setDurationInSeconds] = React.useState('10')

  React.useEffect(() => {
    return cancelEffectCleaning(cancelRequest)
  }, [])

  const handleStart = () => {
    handleLoadTestingIsLoading()
    const data: LoadTesting.StartDto = {
      bufferSizeInKB,
      durationInSeconds,
    }

    axios
      .post(`/api/load-testing/${type}/start`, data, {
        cancelToken: assignCancelToken(cancelRequest),
      })
      .then(() => {
        startCallback()
      })
      .then(() => {
        handleLoadTestingIsNotLoading()
      })
  }

  const handleBufferSizeChange = (e: object, value: number) => {
    setBufferSizeInKB(value)
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(+e.target.value)) {
      setDurationInSeconds(e.target.value)
    }
  }

  return (
    <>
      <div className={classes.flexContainer}>
        <div>
          <TextField
            id="duration-in-seconds"
            disabled={isLoading || isFormDisabled}
            label="Duration in seconds"
            margin="normal"
            onChange={handleDurationChange}
            type="number"
            variant="outlined"
            value={durationInSeconds}
          />
        </div>
        <div style={{ flex: 1 }}>
          <BufferSizeSlider
            disabled={isLoading || isFormDisabled}
            onChange={handleBufferSizeChange}
            value={bufferSizeInKB}
          />
        </div>
      </div>
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        onClick={handleStart}
        disabled={isLoading || isFormDisabled}
      >
        {isLoading && <CircularProgress className={classes.loader} size={22} />}
        Start
      </Button>
    </>
  )
}

export default NetworkBenchmarkConfig
