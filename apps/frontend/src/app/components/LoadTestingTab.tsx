import React from 'react'

import { LoadTesting } from '@ipfs-perfs/models'
import LoadTestingForm from './LoadTestingForm'
import LoadTestingResults from './LoadTestingResults'

interface Props {
  handleLoadTestingIsLoading: () => void
  handleLoadTestingIsNotLoading: () => void
  isLoading: boolean
  type: LoadTesting.OperationTypes
}

const LoadTestingTab: React.FC<Props> = (props: Props) => {
  const {
    handleLoadTestingIsLoading,
    handleLoadTestingIsNotLoading,
    isLoading,
    type,
  } = props
  const [isFormDisabled, setIsFormDisabled] = React.useState(false)

  const handleLoadTestingStart = React.useCallback(() => {
    setIsFormDisabled(true)
  }, [])

  const handleNewLoadTesting = React.useCallback(() => {
    setIsFormDisabled(false)
  }, [])

  return (
    <>
      <LoadTestingForm
        handleLoadTestingIsLoading={handleLoadTestingIsLoading}
        handleLoadTestingIsNotLoading={handleLoadTestingIsNotLoading}
        isFormDisabled={isFormDisabled}
        isLoading={isLoading}
        startCallback={handleLoadTestingStart}
        type={type}
      />
      <LoadTestingResults newCallback={handleNewLoadTesting} type={type} />
    </>
  )
}

export default LoadTestingTab
