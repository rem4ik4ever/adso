import React, { useState, createRef, useEffect } from "react";
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
import { useRouter } from "next/router";
import queryString from "query-string";
import { getLatLngFromAddress } from "../Location/geocoding";

const useStyles = makeStyles(theme => ({
  base: {
    transition: "all 300ms ease-in-out",
    border: "1px solid #ccc",
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    // marginTop: theme.spacing(2),
    // marginBottom: theme.spacing(2),
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
  },
  activeFilters: {
    color: theme.palette.secondary.light
  }
}));

const getLocationFromFilters = async loc => {
  let location = null;
  if (loc) {
    const { latitude, longitude } = await getLatLngFromAddress(loc);
    if (latitude && longitude) {
      location = {
        latitude,
        longitude
      };
    }
  }
  return location;
};

const Search = ({ placeholder, withAdvanced = true }) => {
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const [showFilters, toggleFilters] = useState(false);
  const inputRef = createRef();
  const classes = useStyles();
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (router.query.search) inputRef.current.value = router.query.search;
  }, []);

  const handleFilters = (prop, value) => {
    let newFilters = { ...filters };
    if (prop == "location") {
      getLocationFromFilters(value).then(({ latitude, longitude }) => {
        newFilters.location = {
          ...newFilters.location,
          latitude,
          longitude
        };
        if (!newFilters.distance) {
          newFilters.location.distance = 30;
        }
        setFilters(newFilters);
      });
    } else if (prop == "distance") {
      newFilters.location = {
        ...newFilters.location,
        distance: value
      };
      setFilters(newFilters);
    } else if (prop == "fromPrice") {
      newFilters.priceRange = {
        ...newFilters.priceRange,
        from: value
      };
      setFilters(newFilters);
    } else if (prop == "toPrice") {
      newFilters.priceRange = {
        ...newFilters.priceRange,
        to: value
      };
      setFilters(newFilters);
    } else if (prop == "searchTerm") {
      newFilters.searchTerm = value;
      setFilters(newFilters);
    }
  };

  const toggleOptions = e => {
    e.preventDefault();
    setFocused(true);
    toggleFilters(showFilters => !showFilters);
  };

  const triggerFilter = e => {
    e.preventDefault();
    const parsed = queryString.parse(location.search);
    parsed.search = "";
    if (filters.searchTerm) {
      parsed.search = filters.searchTerm;
    }
    if (withAdvanced) {
      if (
        filters.location &&
        filters.location.latitude &&
        filters.location.longitude
      ) {
        parsed.location = [
          filters.location.latitude,
          filters.location.longitude,
          filters.location.distance
        ];
      }
      if (filters.priceRange) {
        parsed.priceRange = [filters.priceRange.from, filters.priceRange.to];
      }
    }
    router.replace(`${location.pathname}?${queryString.stringify(parsed)}`);
  };
  const handleEnter = e => {
    if (e.keyCode == 13 && !showFilters) {
      triggerFilter(e);
    }
  };

  return (
    <Box pt={2}>
      <ClickAwayListener
        onClickAway={e => {
          if (!showFilters) {
            setFocused(false);
          }
        }}
      >
        <div className={clsx([classes.base, focused && classes.active])}>
          <Box display="flex" alignItems="center">
            {withAdvanced && (
              <IconButton size="small" onClick={toggleOptions}>
                <TuneIcon
                  className={clsx([
                    classes.icon,
                    !focused && classes.inActiveSearchIcon,
                    showFilters && classes.activeFilters
                  ])}
                />
              </IconButton>
            )}
            <InputBase
              className={classes.searchInput}
              placeholder={placeholder}
              inputRef={inputRef}
              onFocus={e => {
                e.preventDefault();
                setFocused(true);
              }}
              onKeyDown={handleEnter}
              onChange={e => {
                handleFilters("searchTerm", e.target.value);
              }}
              inputProps={{ "aria-label": "search" }}
            />

            <IconButton size="small" onClick={triggerFilter}>
              <SearchIcon
                className={clsx([
                  classes.icon,
                  !focused && classes.inActiveSearchIcon
                ])}
              />
            </IconButton>
          </Box>
          <Collapse in={showFilters}>
            <Filters onChange={handleFilters} />
          </Collapse>
        </div>
      </ClickAwayListener>
    </Box>
  );
};

export default Search;
