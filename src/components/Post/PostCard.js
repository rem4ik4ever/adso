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
  CardActionArea,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import MessageIcon from "@material-ui/icons/Message";
import ShareIcon from "@material-ui/icons/Share";
import EditIcon from "@material-ui/icons/Edit";
import { useRouter } from "next/dist/client/router";
import { useIdentityContext } from "../../hooks/useIdentity";
import Link from "next/link";

const useStyles = makeStyles(theme => ({
  card: {
    [theme.breakpoints.up("sm")]: {
      margin: theme.spacing(1),
      maxWidth: 200,
      minWidth: 200
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2)
    }
  },
  media: {
    height: 0,
    [theme.breakpoints.up("sm")]: {
      paddingTop: "100%"
    },
    [theme.breakpoints.down("sm")]: {
      paddingTop: "56.25%"
    }
  },
  price: {
    fontSize: "1.05rem",
    color: theme.palette.primary.dark
  },
  contentImage: {
    width: 130,
    marginRight: theme.spacing(1)
  },
  img: {
    width: "inherit"
  },
  title: {
    fontSize: "0.85rem",
    fontWeight: 500,
    minHeight: "40px"
  },
  date: {
    fontSize: "0.65rem",
    color: theme.palette.sub.main
  }
}));

export const PostCard = ({ post }) => {
  const classes = useStyles();
  const router = useRouter();
  const { user } = useIdentityContext();
  const isMyAd = user && user.uuid == post.authorId;
  return (
    <Card className={classes.card}>
      <CardActionArea onClick={e => router.push(`/p?id=${post.id}`)}>
        <CardMedia
          className={classes.media}
          image={post.images[0]}
          title={post.title}
        />
      </CardActionArea>
      <CardContent>
        <Box>
          <Typography className={classes.title}>
            {post.title.slice(0, 40)}
            {post.title.length > 40 ? "..." : ""}
          </Typography>
          <Typography className={classes.date}>
            {moment(+post.createdAt).fromNow()}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Box
          display="flex"
          justifyContent="space-between"
          flexGrow="1"
          alignItems="center"
        >
          <Box>
            {post.priceInfo.toLowerCase() == "fixed" ? (
              <Box>
                <Typography className={classes.price}>${post.price}</Typography>
              </Box>
            ) : (
              <Typography variant="caption">Contact for Price</Typography>
            )}
          </Box>
          <Box display="flex" justifyContent="flex-end">
            {isMyAd ? (
              <Link href={`/my-ads/edit?id=${post.id}`}>
                <Button
                  startIcon={<EditIcon />}
                  color="secondary"
                  variant="outlined"
                >
                  Edit
                </Button>
              </Link>
            ) : (
              <>
                <IconButton>
                  <MessageIcon />
                </IconButton>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};
