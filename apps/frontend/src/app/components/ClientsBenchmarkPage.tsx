import React from 'react'

import ClientsBenchmarkConfig from './ClientsBenchmarkConfig'
import ClientsBenchmarkResults from './ClientsBenchmarkResults'

interface Props {}

const ClientsBenchmarkPage: React.FC<Props> = (props: Props) => {
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
        <ClientsBenchmarkResults stopCallback={handleBenchmarkStop} />
      ) : (
        <ClientsBenchmarkConfig startCallback={handleBenchmarkStart} />
      )}
    </>
  )
}

export default ClientsBenchmarkPage
