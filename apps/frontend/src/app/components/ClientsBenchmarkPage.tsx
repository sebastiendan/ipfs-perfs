import { makeStyles, Theme } from '@material-ui/core'
import React from 'react'

import ClientsBenchmarkForm from './ClientsBenchmarkForm'
import ClientsBenchmarkResults from './ClientsBenchmarkResults'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2.5),
  },
}))

const ClientsBenchmarkPage: React.FC = () => {
  const classes = useStyles()
  const [isColorBlind, setIsColorBlind] = React.useState(false)
  const [showResult, setShowResult] = React.useState(false)

  const handleBenchmarkStart = React.useCallback(() => {
    setShowResult(true)
  }, [])

  const handleBenchmarkStop = React.useCallback(() => {
    setShowResult(false)
  }, [])

  const handleIsColorBlindChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsColorBlind(event.target.checked)
  }

  return (
    <div className={classes.root}>
      {showResult ? (
        <ClientsBenchmarkResults
          isColorBlind={isColorBlind}
          stopCallback={handleBenchmarkStop}
        />
      ) : (
        <ClientsBenchmarkForm
          isColorBlind={isColorBlind}
          handleIsColorBlindChange={handleIsColorBlindChange}
          startCallback={handleBenchmarkStart}
        />
      )}
    </div>
  )
}

export default ClientsBenchmarkPage
