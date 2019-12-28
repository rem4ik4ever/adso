import React from "react";
import { makeStyles } from "@material-ui/styles";
import { throttle } from "lodash";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import parse from "autosuggest-highlight/parse";

const autocompleteService = { current: null };

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  },
  input: {
    borderRadius: theme.spacing(1),
    width: "100%"
  }
}));

export const PlaceAutocomplete = ({
  value,
  onChange,
  label = "Place to meet",
  variant = "outlined"
}) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState(value);
  const [options, setOptions] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState(null);
  const handleChange = event => {
    setInputValue(event.target.value);
  };

  const fetch = React.useMemo(
    () =>
      throttle((input, callback) => {
        autocompleteService.current.getPlacePredictions(input, callback);
      }, 200),
    []
  );
  React.useEffect(() => {
    if (!autocompleteService.current && google) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
    }
    if (value) {
      fetch(
        { input: value, componentRestrictions: { country: "ca" } },
        results => {
          if (results) {
            setOptions(results, []);
            setSelectedOption(results[0]);
          } else {
            setOptions([], []);
          }
        }
      );
    }
  }, [value]);

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && google) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
    }

    if (!autocompleteService.current) {
      return undefined;
    }
    if (inputValue === "") {
      setOptions([]);
      return undefined;
    }
    if (inputValue) {
      fetch(
        { input: inputValue, componentRestrictions: { country: "ca" } },
        results => {
          if (active && results) {
            setOptions(results, []);
          } else {
            setOptions([], []);
          }
        }
      );
    }

    return () => {
      active = false;
    };
  }, [inputValue, fetch]);

  return (
    <Autocomplete
      id="google-map-demo"
      className={classes.input}
      getOptionLabel={option =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={x => x}
      options={options}
      autoComplete
      includeInputInList
      disableOpenOnFocus
      value={selectedOption}
      onChange={(e, option) => {
        if (option) {
          setSelectedOption(option);
          onChange(option.description);
        }
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          variant={variant}
          fullWidth
          onChange={handleChange}
        />
      )}
      renderOption={option => {
        const matches =
          option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map(match => [match.offset, match.offset + match.length])
        );

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {part.text}
                </span>
              ))}

              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
};
