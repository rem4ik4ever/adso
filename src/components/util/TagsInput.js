import React, { useState, useEffect } from "react";
import { Box, Chip, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  tag: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  tagInput: {
    marginTop: theme.spacing(1)
  }
}));

const TagsInput = ({ onChange, onAdd, tags }) => {
  const classes = useStyles();
  const enterCodes = [13, 32, 9]; // Enter , Space , Tab
  const handleDelete = index => {
    onChange([...tags.slice(0, index), ...tags.slice(index + 1, tags.length)]);
  };
  const onTagEnter = e => {
    if (enterCodes.includes(e.keyCode)) {
      e.preventDefault();
      const tag = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-");
      if (tag !== "" && tags.indexOf(tag) < 0) {
        onAdd(tag);
        e.target.value = "";
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" alignItems="center" flexWrap="wrap">
        {tags.map((tag, index) => (
          <Chip
            className={classes.tag}
            key={index}
            label={tag}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </Box>
      <TextField
        className={classes.tagInput}
        label="Add tags (Space to add)"
        onKeyDown={onTagEnter}
      />
    </Box>
  );
};

export default TagsInput;
