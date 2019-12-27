import React, { useState, createRef } from "react";
import {
  InputBase,
  ClickAwayListener,
  Box,
  IconButton,
  Collapse,
  Paper
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import SearchIcon from "@material-ui/icons/Search";
import TuneIcon from "@material-ui/icons/Tune";
import clsx from "clsx";
import Filters from "./Filters";

const useStyles = makeStyles(theme => ({
  base: {
    transition: "all 300ms ease-in-out",
    border: "1px solid #ccc",
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(5),
    fontSize: "1.4rem",
    lineHeight: "2rem",
    fontWeight: 300,
    position: "relative"
  },
  active: {
    // borderColor: "red"
    // boxShadow: `0 0 ${theme.spacing(2)}px #ccc`,
    backgroundColor: "#ffffff"
  },
  searchInput: {
    marginLeft: theme.spacing(2),
    width: "100%"
  },
  icon: {
    transition: "color 300ms ease-in-out"
  },
  inActiveSearchIcon: {
    color: "#ccc"
  }
}));

const Search = ({ placeholder, onChange }) => {
  const [focused, setFocused] = useState(false);
  const [showFilters, toggleFilters] = useState(false);
  const inputRef = createRef();
  const classes = useStyles();

  const handleClick = e => {
    e.preventDefault();
    // inputRef.current.focus();
  };
  const toggleOptions = e => {
    e.preventDefault();
    setFocused(true);
    toggleFilters(showFilters => !showFilters);
  };
  return (
    <ClickAwayListener
      onClickAway={e => {
        setFocused(false);
        toggleFilters(false);
      }}
    >
      <Box>
        <div
          className={clsx([classes.base, focused && classes.active])}
          onClick={handleClick}
        >
          <Box display="flex" alignItems="center">
            <IconButton size="small">
              <SearchIcon
                className={clsx([
                  classes.icon,
                  !focused && classes.inActiveSearchIcon
                ])}
              />
            </IconButton>
            <InputBase
              className={classes.searchInput}
              placeholder={placeholder}
              inputRef={inputRef}
              onFocus={e => {
                e.preventDefault();
                setFocused(true);
              }}
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton size="small" onClick={toggleOptions}>
              <TuneIcon
                className={clsx([
                  classes.icon,
                  !focused && classes.inActiveSearchIcon
                ])}
              />
            </IconButton>
          </Box>
          <Collapse in={showFilters}>
            <Filters />
          </Collapse>
        </div>
      </Box>
    </ClickAwayListener>
  );
};

export default Search;
