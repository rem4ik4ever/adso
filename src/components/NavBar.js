import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import { useIdentityContext } from "../hooks/useIdentity";
import { Avatar } from "@material-ui/core";
import { withIdentity } from "../hoc/withIdentity";

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
    color: "white"
  }
}));

const NavBar = () => {
  const { isLoggedIn, user, logout } = useIdentityContext();
  const classes = useStyles();
  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu-button"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Home
        </Typography>
        {isLoggedIn ? (
          <>
            <Avatar>
              {user.firstName[0]}
              {user.lastName[0]}
            </Avatar>
            <Button className={classes.buttonLink} onClick={e => logout()}>
              Logout
            </Button>
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
