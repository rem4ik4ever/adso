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
    margin: theme.spacing(1),
    position: "relative",
    width: "300px",
    height: "fit-content",
    position: "sticky",
    top: theme.spacing(1) + 48
  }
}));

const ActionsList = () => {
  const classes = useStyles();
  return (
    <Card className={classes.actionsList}>
      <CardHeader title="Actions" />
      <CardContent>
        <List>
          <Link href="/my-ads">
            <ListItem button>
              <ListItemIcon>
                <FormatListBulleted />
              </ListItemIcon>
              <ListItemText>My Ads</ListItemText>
            </ListItem>
          </Link>
          <Link href="/post-ad">
            <ListItem button>
              <ListItemIcon>
                <Create />
              </ListItemIcon>
              <ListItemText>Post Ad</ListItemText>
            </ListItem>
          </Link>
          <Link href="/settings">
            <ListItem button>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </ListItem>
          </Link>
        </List>
      </CardContent>
    </Card>
  );
};

export default ActionsList;
