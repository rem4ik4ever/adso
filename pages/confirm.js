import React, { useEffect, useState } from "react";
import {
  Avatar,
  Container,
  Typography,
  CircularProgress,
  Link,
  Button
} from "@material-ui/core";
import { Check, Error } from "@material-ui/icons/";
import { makeStyles } from "@material-ui/styles";
import { CONFIRM_USER } from "../src/graphql/authResolvers";
import { useMutation } from "@apollo/react-hooks";
import queryString from "query-string";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  }
}));

const Confirm = () => {
  const classes = useStyles();
  const [confirmed, setState] = useState(false);
  const [confirmUser, { loading, error }] = useMutation(CONFIRM_USER, {
    onCompleted: data => {
      console.log("User confirmed!");
      // setTimeout(() => {
      //   Router.replace("/confirm", "/login", { shallow: true });
      // }, 4000);
      if (data.confirmUser) {
        setState(true);
      }
    },
    onError: err => {
      console.log("Failed to confirm user");
      console.error(err);
    }
  });
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    console.log("parsed", parsed);
    if (parsed.token) {
      confirmUser({
        variables: {
          token: parsed.token
        }
      });
    }
  }, []);
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        {loading ? (
          <>
            <CircularProgress />
            <Typography>Running confirmation</Typography>
          </>
        ) : (
          <>
            {error || !confirmed ? (
              <>
                <Avatar className={classes.avatar}>
                  <Error />
                </Avatar>
                <Typography>Confirmation failed</Typography>
                <Button>Try resend confiramtion?</Button>
              </>
            ) : (
              <>
                <Avatar className={classes.avatar}>
                  <Check />
                </Avatar>
                <Typography>Registration complete!</Typography>
              </>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default Confirm;
