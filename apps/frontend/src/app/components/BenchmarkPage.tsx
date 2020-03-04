import React from 'react'

import BenchmarkConfig from './BenchmarkConfig'
import BenchmarkResults from './BenchmarkResults'

interface Props {}

const BenchmarkPage: React.FC<Props> = (props: Props) => {
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
        <BenchmarkResults stopCallback={handleBenchmarkStop} />
      ) : (
        <BenchmarkConfig startCallback={handleBenchmarkStart} />
      )}
    </>
  )
}

export default BenchmarkPage
