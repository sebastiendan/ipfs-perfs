import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import axios from 'axios'
import React from 'react'

interface Props {
  startCallback: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

const BenchmarkConfig: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { startCallback } = props
  const [bufferSize, setBufferSize] = React.useState(1000)

  const handleStart = () => {
    axios.post('/api/perfs/start', { bufferSize }).then(() => {
      startCallback()
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
        step={10}
        marks={marks}
        min={10}
        max={10000}
      />
      <Button variant="outlined" color="primary" onClick={handleStart}>
        Start
      </Button>
    </>
  )
}

export default BenchmarkConfig
