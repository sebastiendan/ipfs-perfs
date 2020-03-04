import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import AboutPage from '../components/AboutPage'
import BenchmarkPage from '../components/BenchmarkPage'

const routes = (
  <Switch>
    <Route exact={true} path="/" component={BenchmarkPage} />
    <Route path="/benchmark" component={BenchmarkPage} />
    <Route path="/about" component={AboutPage} />
    <Redirect to="/" />
  </Switch>
)

export default routes
