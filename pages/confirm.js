import React, { useEffect, useState } from "react";
import {
  Avatar,
  Container,
  Typography,
  CircularProgress,
  Link,
  Button
} from "@material-ui/core";
import { Check, Error, Mail } from "@material-ui/icons/";
import { makeStyles } from "@material-ui/styles";
import {
  CONFIRM_USER,
  RESEND_CONFIRMATION
} from "../src/graphql/authResolvers";
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
  const [showResend, setShowResend] = useState(false);
  const [confirmationResent, setResent] = useState(false);

  const [confirmUser, { loading, error }] = useMutation(CONFIRM_USER, {
    onCompleted: data => {
      if (data.confirmUser) {
        setState(true);
        setTimeout(() => {
          console.log("SHOULD REDIRECT NOW");
          location.href = "/sign-in";
        }, 4000);
      }
    },
    onError: err => {
      console.log("Failed to confirm user");
      console.error(err);
      if (err.message.includes("ConfirmationTokenExpired")) {
        setShowResend(true);
      }
    }
  });

  const [resendConfirmation] = useMutation(RESEND_CONFIRMATION, {
    onCompleted: () => {
      setShowResend(false);
      setResent(true);
    },
    onError: () => {
      setShowResend(false);
    }
  });
  useEffect(() => {
    const parsed = queryString.parse(location.search);
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
        {confirmationResent ? (
          <>
            <Avatar className={classes.avatar}>
              <Mail />
            </Avatar>
            <Typography>Confirmation has been sent!</Typography>
          </>
        ) : (
          <>
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
                    {showResend && (
                      <Button
                        onClick={e => {
                          e.preventDefault();
                          let parsed = queryString.parse(location.search);
                          resendConfirmation({
                            variables: {
                              token: parsed.token
                            }
                          });
                        }}
                      >
                        Try resend confiramtion?
                      </Button>
                    )}
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
          </>
        )}
      </div>
    </Container>
  );
};

export default Confirm;
