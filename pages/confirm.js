import React, { useEffect, useState } from "react";
import {
  Avatar,
  Container,
  Typography,
  CircularProgress,
  Button
} from "@material-ui/core";
import { Check, Error, Mail } from "@material-ui/icons/";
import { makeStyles } from "@material-ui/styles";
import { CONFIRM_USER } from "../src/graphql/authResolvers";
import { useMutation } from "@apollo/react-hooks";
import queryString from "query-string";
import { useRouter } from "next/router";
import { withSnackbar } from "notistack";

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

const Confirm = ({ enqueueSnackbar }) => {
  const classes = useStyles();
  const router = useRouter();
  const [confirmed, setState] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const [confirmUser, { loading, error }] = useMutation(CONFIRM_USER, {
    onCompleted: data => {
      if (data.confirm) {
        setState(true);
        setTimeout(() => {
          router.push("/sign-in");
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
        {
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
                          enqueueSnackbar(
                            "Please enter your email and password to resend confirmation email",
                            { variant: "info" }
                          );
                          router.push(`/sign-in?resend=true`);
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
        }
      </div>
    </Container>
  );
};

export default withSnackbar(Confirm);
