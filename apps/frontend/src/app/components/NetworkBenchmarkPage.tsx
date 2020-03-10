import React from 'react'

import NetworkBenchmarkConfig from './NetworkBenchmarkConfig'
import NetworkBenchmarkResults from './NetworkBenchmarkResults'

interface Props {}

const NetworkBenchmarkPage: React.FC<Props> = (props: Props) => {
  const [showResult, setShowResult] = React.useState(false)

  const handleBenchmarkStart = React.useCallback(() => {
    setShowResult(true)
  }, [])

  const handleBenchmarkStop = React.useCallback(() => {
    setShowResult(false)
  }, [])

  return (
    <>
      {showResult ? (
        <NetworkBenchmarkResults stopCallback={handleBenchmarkStop} />
      ) : (
        <NetworkBenchmarkConfig startCallback={handleBenchmarkStart} />
      )}
    </>
  )
}

export default NetworkBenchmarkPage
