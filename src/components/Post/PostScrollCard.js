import React from "react";
import {
  Card,
  CardHeader,
  Avatar,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CardActions,
  IconButton,
  CardActionArea
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import MessageIcon from "@material-ui/icons/Message";
import ShareIcon from "@material-ui/icons/Share";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";

const useStyles = makeStyles(theme => ({
  priceText: {
    color: theme.palette.white,
    // backgroundColor: theme.palette.sub.main,
    fontSize: "1.35rem",
    fontWeight: 600
  },
  contentImage: {
    width: 130,
    marginRight: theme.spacing(1)
  },
  img: {
    height: "inherit"
  },
  whiteText: {
    color: theme.palette.white
  },
  box: {
    borderRadius: theme.spacing(2),
    margin: theme.spacing(1),
    boxShadow: `0 0 8px ${theme.palette.shadow.main}`,
    position: "relative",
    width: 180,
    height: 260,
    cursor: "pointer",
    transition: "all ease-in-out 200ms",
    [theme.breakpoints.up("sm")]: {
      transform: "scale(0.9)",
      "&:hover": {
        boxShadow: `0 0 8px #000`,
        transform: "scale(1)"
      }
    }
  },
  cardBox: {
    position: "relative",
    width: "inherit",
    height: "inherit",
    overflow: "hidden",
    borderRadius: theme.spacing(2)
  },
  textOverlay: {
    borderRadius: theme.spacing(2),
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    background: "rgb(0,75,160)",
    background:
      "linear-gradient(0deg, rgba(0,75,160,0.55) 0%, rgba(214,214,214,0.09567577030812324) 25%, rgba(214,214,214,0.0984768907563025) 75%, rgba(0,75,160,0.5466561624649859) 100%)",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  }
}));

export const PostScrollCard = ({ post }) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Link href={`/p?id=${post.uuid}`}>
      <div className={classes.box}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          className={classes.cardBox}
        >
          <img src={post.images[0]} art={post.title} className={classes.img} />
        </Box>
        <Box className={classes.textOverlay}>
          <Box>
            <Typography className={classes.whiteText}>
              {post.title.slice(0, 20)}
              {post.title.length > 20 ? "..." : ""}
            </Typography>
          </Box>
          <Box>
            {post.priceInfo.toLowerCase() == "fixed" ? (
              <Box>
                <Typography className={classes.priceText}>
                  ${post.price}
                </Typography>
              </Box>
            ) : (
              <Typography variant="subtitle2" className={classes.whiteText}>
                Contact for Price
              </Typography>
            )}
          </Box>
        </Box>
      </div>
    </Link>
  );
};
