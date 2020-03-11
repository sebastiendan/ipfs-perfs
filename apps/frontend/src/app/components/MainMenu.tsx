import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles, Theme, useTheme } from '@material-ui/core'
import { Compare, Info, SettingsInputComponent } from '@material-ui/icons'
import React from 'react'
import { NavLink } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) => ({
  '@global': {
    'a.is-main-menu-item-active:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: 5,
      backgroundColor: theme.palette.secondary.main,
    },
    ul: {
      padding: '0 !important',
    },
  },
  homeLink: {
    display: 'block',
    height: 64,
    position: 'relative',
    textAlign: 'center',
  },
  homeLogo: {
    height: '80%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  link: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar,
}))

const Link = (to: string) => {
  const theme = useTheme()

  return React.forwardRef((props: any, ref: any) => (
    <NavLink
      activeClassName="is-main-menu-item-active"
      style={{
        paddingBottom: theme.spacing(2),
        paddingTop: theme.spacing(2),
      }}
      to={to}
      {...props}
      ref={ref}
    />
  ))
}

const MainMenu: React.FC = () => {
  const classes = useStyles()

  return (
    <div>
      <div className={classes.toolbar}>
        <NavLink className={classes.homeLink} to="/">
          <img className={classes.homeLogo} src="assets/logo-200.png" />
        </NavLink>
      </div>
      <Divider />
      <List>
        <ListItem button component={Link('/clients-benchmark')}>
          <ListItemIcon>
            <Compare />
          </ListItemIcon>
          <ListItemText primary="Clients benchmark" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={Link('/load-testing')}>
          <ListItemIcon>
            <SettingsInputComponent />
          </ListItemIcon>
          <ListItemText primary="Load testing" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={Link('/about')}>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
      </List>
    </div>
  )
}

export default MainMenu
