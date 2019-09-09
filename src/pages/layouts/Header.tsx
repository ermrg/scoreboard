import React, { useContext, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import classNames from "classnames";
import { Theme, makeStyles } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from '@material-ui/icons/People';
import InputIcon from "@material-ui/icons/Input";
import { AuthContext } from "../Auth/AuthProvider";
import firebase from "../firebaseApp";
import logo from '../../assets/images/logo.png';

const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) => ({
  logo: {
    width: 45,
    verticalAlign: "bottom"
  },
  root: {
    display: "flex"
  },
  appBar: {
    padding: "0 16px",
    boxShadow: "0 1px 1px 0 rgba(0,0,0,0.10)",
    backgroundColor: "#ffffff",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: drawerWidth
  },
  toolbar: {
    paddingLeft: 0,
    minHeight: 64
  },
  menuButton: {
    color: "#000000",
    marginLeft: 12,
    position: "absolute",
    right: 0
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-start"
  },
  listItem: {
    paddingTop: 20,
    paddingBottom: 20
  },
  signOutIcon: {
    "& svg": {
      transform: "scale(-1, 1)"
    }
  }
}));

interface Props extends RouteComponentProps {}

function Header(props: Props) {
  const classes = useStyles({});

  const { history } = props;

  const { loadingAuthState, authenticated, setUser } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const moveToPage = (path: string) => {
    setOpen(false);
    history.push(path);
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        setOpen(false);
        history.push("/auth");
      });
  };

  interface HeaderMenuItemProps {
    text: string;
    onClick(): void;
    icon: any;
  }

  const HeaderMenuItem = ({ text, onClick, icon }: HeaderMenuItemProps) => {
    return (
      <ListItem button className={classes.listItem} onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    );
  };

  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar
          disableGutters={!open}
          variant="dense"
          className={classes.toolbar}
        >
          <Link onClick={() => history.push("/")}>
            <img src={logo} alt="Gimmy" className={classes.logo} />
          </Link>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={classNames(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <HeaderMenuItem
          text="Home"
          onClick={() => moveToPage("/")}
          icon={<HomeIcon />}
        />
        <Divider />
        <List>
          {!loadingAuthState && authenticated && (
            <React.Fragment>
              <HeaderMenuItem
                text="Players"
                onClick={() => moveToPage("/players")}
                icon={<PeopleIcon />}
              />
            </React.Fragment>
          )}
          
          {!loadingAuthState && authenticated && (
            <React.Fragment>
              <HeaderMenuItem
                text="Teams"
                onClick={() => moveToPage("/teams")}
                icon={<PeopleIcon />}
              />
            </React.Fragment>
          )}

          {!loadingAuthState && authenticated && (
            <HeaderMenuItem
              text="Logout"
              onClick={signOut}
              icon={<InputIcon />}
            />
          )}
        </List>
      </Drawer>
    </React.Fragment>
  );
}

export default (withRouter(Header));
