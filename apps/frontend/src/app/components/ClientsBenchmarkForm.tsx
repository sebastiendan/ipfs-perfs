import { makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import axios from 'axios'
import React from 'react'

import { assignCancelToken, cancelEffectCleaning } from '../../config'
import BufferSizeSlider from './BufferSizeSlider'

let cancelRequest

interface Props {
  handleIsColorBlindChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isColorBlind: boolean
  startCallback: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
  flexContainer: {
    '& > *': {
      padding: theme.spacing(1),
    },
    display: 'flex',
    justifyContent: 'space-around',
  },
  loader: {
    marginRight: theme.spacing(1.5),
    opacity: 0.5,
  },
  switch: {
    marginBottom: theme.spacing(2),
  },
}))

const ClientsBenchmarkConfig: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { handleIsColorBlindChange, isColorBlind, startCallback } = props
  const [bufferSizeInKB, setBufferSizeInKB] = React.useState(1000)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    return cancelEffectCleaning(cancelRequest)
  }, [])

  const handleStart = () => {
    setIsLoading(true)

    axios
      .post(
        '/api/clients-benchmark/start',
        { bufferSizeInKB },
        {
          cancelToken: assignCancelToken(cancelRequest),
        }
      )
      .then(() => {
        startCallback()
      })
      .then(() => {
        setIsLoading(false)
      })
  }

  const handleBufferSizeChange = (e: object, value: number) => {
    setBufferSizeInKB(value)
  }

  return (
    <>
      <div className={classes.flexContainer}>
        <div>
          <FormControlLabel
            className={classes.switch}
            control={
              <Switch
                checked={isColorBlind}
                onChange={handleIsColorBlindChange}
                size="small"
              />
            }
            label="Color blind mode"
          />
        </div>
        <div style={{ flex: 1 }}>
          <BufferSizeSlider
            disabled={isLoading}
            onChange={handleBufferSizeChange}
            value={bufferSizeInKB}
          />
        </div>
      </div>
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

export default ClientsBenchmarkConfig
