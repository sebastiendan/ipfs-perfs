import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from '@material-ui/core'
import * as colors from '@material-ui/core/colors'
import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter } from 'react-router-dom'

import App from './app/app'

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#202a30',
      paper: '#2e3941',
    },
    primary: colors.blue,
    secondary: colors.orange,
    type: 'dark',
  },
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MuiThemeProvider>,
  document.getElementById('root')
)
