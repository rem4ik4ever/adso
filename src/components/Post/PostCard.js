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
      margin: theme.spacing(2),
      maxWidth: 240,
      minWidth: 240
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2)
    }
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
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
        <CardHeader
          avatar={<Avatar aria-label="author">RK</Avatar>}
          title={`${post.title.slice(0, 20)}${
            post.title.length > 20 ? "..." : ""
          }`}
          subheader={moment(+post.createdAt).fromNow()}
        />
      </CardActionArea>
      <CardMedia
        className={classes.media}
        image={post.images[0]}
        title={post.title}
      />
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
              <Typography variant="subtitle2">Contact for Price</Typography>
            )}
          </Box>
          <Box>
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
