import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { Compare, Info, SettingsInputComponent } from '@material-ui/icons'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
  })
)

const Link = (to: string) =>
  React.forwardRef((props: any, ref: any) => (
    <RouterLink to={to} {...props} ref={ref} />
  ))

const MainMenu: React.FC = () => {
  const classes = useStyles()

  return (
    <div>
      <div className={classes.toolbar} />
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
