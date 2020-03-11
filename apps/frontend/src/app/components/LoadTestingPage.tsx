import { makeStyles, Theme, useTheme } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import React from 'react'
import SwipeableViews from 'react-swipeable-views'

import LoadTestingTab from './LoadTestingTab'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}))

const NetworkBenchmarkPage: React.FC = () => {
  const classes = useStyles()
  const theme = useTheme()
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleChange = (event: React.ChangeEvent<{}>, value: number) => {
    setSelectedTab(value)
  }

  const handleChangeIndex = (index: number) => {
    setSelectedTab(index)
  }

  const handleLoadTestingIsLoading = React.useCallback(() => {
    setIsLoading(true)
  }, [])

  const handleLoadTestingIsNotLoading = React.useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          centered
          indicatorColor="secondary"
          onChange={handleChange}
          textColor="secondary"
          value={selectedTab}
        >
          <Tab disabled={isLoading} label="Write" />
          <Tab disabled={isLoading} label="Read" />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis="x"
        index={selectedTab}
        onChangeIndex={handleChangeIndex}
        slideStyle={{ padding: theme.spacing(2.5) }}
      >
        <div hidden={selectedTab !== 0}>
          <LoadTestingTab
            isLoading={isLoading}
            handleLoadTestingIsLoading={handleLoadTestingIsLoading}
            handleLoadTestingIsNotLoading={handleLoadTestingIsNotLoading}
            type="write"
          />
        </div>
        <div hidden={selectedTab !== 1}>
          <LoadTestingTab
            isLoading={isLoading}
            handleLoadTestingIsLoading={handleLoadTestingIsLoading}
            handleLoadTestingIsNotLoading={handleLoadTestingIsNotLoading}
            type="read"
          />
        </div>
      </SwipeableViews>
    </div>
  )
}

export default NetworkBenchmarkPage
