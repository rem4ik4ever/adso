import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardHeader,
  CardContent
} from "@material-ui/core";
import { FormatListBulleted, Create, Settings } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import Link from "next/link";

const useStyles = makeStyles(theme => ({
  actionsList: {
    [theme.breakpoints.up("sm")]: {
      margin: theme.spacing(1),
      position: "relative",
      width: "300px",
      height: "fit-content",
      position: "sticky",
      top: theme.spacing(1) + 48
    },
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  header: {
    boxShadow: "0 0 3px"
  },
  list: {
    padding: 0
  },
  listItem: {
    borderBottom: "1px solid #eaeaea"
  }
}));

const ActionsList = () => {
  const classes = useStyles();
  return (
    <Card className={classes.actionsList}>
      <CardHeader title="Actions" className={classes.header} />
      <div>
        <List className={classes.list}>
          <Link href="/my-ads">
            <ListItem button className={classes.listItem}>
              <ListItemIcon>
                <FormatListBulleted />
              </ListItemIcon>
              <ListItemText>My Ads</ListItemText>
            </ListItem>
          </Link>
          <Link href="/post-ad">
            <ListItem button className={classes.listItem}>
              <ListItemIcon>
                <Create />
              </ListItemIcon>
              <ListItemText>Post Ad</ListItemText>
            </ListItem>
          </Link>
          <Link href="/settings">
            <ListItem button className={classes.listItem}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </ListItem>
          </Link>
        </List>
      </div>
    </Card>
  );
};

export default ActionsList;
