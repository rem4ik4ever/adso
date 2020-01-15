import React from "react";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import { Settings, ExitToApp, ListAlt } from "@material-ui/icons";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import { useIdentityContext } from "../hooks/useIdentity";
import {
  Avatar,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Paper,
  Hidden,
  ListItemIcon
} from "@material-ui/core";
import { withIdentity } from "../hoc/withIdentity";
import { useRouter } from "next/router";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  buttonLink: {
    color: "black"
  },
  navbar: {
    // backgroundColor: "#fff",
    // color: "black",
    // boxShadow: "none"
  },
  logo: {
    cursor: "pointer"
  }
}));

const NavBar = () => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const router = useRouter();
  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (
      event &&
      anchorRef.current &&
      anchorRef.current.contains(event.target)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false && anchorRef.current) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  const { isLoggedIn, user, logout } = useIdentityContext();
  const classes = useStyles();
  return (
    <AppBar position="sticky" className={classes.navbar}>
      <Toolbar variant="dense">
        <Link href="/">
          <Typography variant="h6" className={classes.logo}>
            tugogo
          </Typography>
        </Link>
        <div className={classes.title}></div>
        {isLoggedIn ? (
          <>
            <IconButton ref={anchorRef} onClick={handleToggle}>
              <Avatar>
                {user.firstName[0]}
                {user.lastName[0]}
              </Avatar>
            </IconButton>
            <Link href="/post-ad">
              <Button variant="contained" color="secondary">
                POST Ad
              </Button>
            </Link>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom"
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem
                          onClick={e => {
                            handleClose();
                            router.push("/my-ads");
                          }}
                        >
                          <ListItemIcon>
                            <ListAlt />
                          </ListItemIcon>
                          My Ads
                        </MenuItem>
                        <MenuItem
                          onClick={e => {
                            handleClose();
                            router.push("/settings");
                          }}
                        >
                          <ListItemIcon>
                            <Settings />
                          </ListItemIcon>
                          Settings
                        </MenuItem>
                        <MenuItem
                          onClick={e => {
                            logout();
                            handleClose();
                          }}
                        >
                          <ListItemIcon>
                            <ExitToApp />
                          </ListItemIcon>
                          Logout
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        ) : (
          <>
            <Link href="/sign-in">
              <Button className={classes.buttonLink}>Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button className={classes.buttonLink}>Sign Up</Button>
            </Link>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default withIdentity(NavBar);
