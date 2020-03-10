import React from 'react'

import LoadTestingForm from './LoadTestingForm'
import LoadTestingResults from './LoadTestingResults'

interface Props {}

const NetworkBenchmarkPage: React.FC<Props> = (props: Props) => {
  const [isFormDisabled, setIsFormDisabled] = React.useState(false)

  const handleBenchmarkStart = React.useCallback(() => {
    setIsFormDisabled(true)
  }, [])

  const handleNewBenchmark = React.useCallback(() => {
    setIsFormDisabled(false)
  }, [])

  return (
    <>
      <LoadTestingForm
        startCallback={handleBenchmarkStart}
        disabled={isFormDisabled}
      />
      <LoadTestingResults newCallback={handleNewBenchmark} />
    </>
  )
}

export default NetworkBenchmarkPage
