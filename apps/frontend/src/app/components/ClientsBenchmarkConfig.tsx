import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Slider from '@material-ui/core/Slider'
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

const ClientsBenchmarkConfig: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { startCallback } = props
  const [bufferSize, setBufferSize] = React.useState(1000)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleStart = () => {
    setIsLoading(true)

    axios
      .post('/api/clients-benchmark/start', { bufferSize })
      .then(() => {
        startCallback()
      })
      .then(() => {
        setIsLoading(false)
      })
  }

  const handleSliderChange = (e: object, value: number) => {
    setBufferSize(value)
  }

  return (
    <>
      <Typography className={classes.title}>Buffer size (kB)</Typography>
      <Slider
        getAriaValueText={valuetext}
        aria-labelledby="slider"
        valueLabelDisplay="on"
        value={bufferSize}
        onChange={handleSliderChange}
        disabled={isLoading}
        step={10}
        marks={marks}
        min={10}
        max={10000}
      />
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
