import { makeStyles, Theme } from '@material-ui/core'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  ({
    title: {
      marginBottom: theme.spacing(5),
    },
  })
)

interface Props {
  disabled: boolean
  onChange: (e: object, value: number) => void
  value: number
}

function valuetext(value: number) {
  return `${value}kB`
}

const marks = [
  { value: 10, label: '10kB' },
  { value: 1000, label: '1MB' },
  { value: 10000, label: '10MB' },
]

const BufferSizeSlider: React.FC<Props> = (props: Props) => {
  const { disabled, onChange, value } = props
  const classes = useStyles()

  return (
    <div>
      <Typography className={classes.title} component="div" variant="body2">
        Buffer size (kB)
      </Typography>
      <Slider
        getAriaValueText={valuetext}
        disabled={disabled}
        marks={marks}
        min={10}
        max={10000}
        onChange={onChange}
        step={10}
        value={value}
        valueLabelDisplay="on"
      />
    </div>
  )
}

export default BufferSizeSlider
