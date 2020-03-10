import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import AboutPage from '../components/AboutPage'
import ClientsBenchmarkPage from '../components/ClientsBenchmarkPage'
import LoadTestingPage from '../components/LoadTestingPage'

const routes = (
  <Switch>
    <Route exact={true} path="/" component={ClientsBenchmarkPage} />
    <Route path="/clients-benchmark" component={ClientsBenchmarkPage} />
    <Route path="/load-testing" component={LoadTestingPage} />
    <Route path="/about" component={AboutPage} />
    <Redirect to="/" />
  </Switch>
)

export default routes
