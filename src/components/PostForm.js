import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_POST } from "../graphql/postResolvers";
import { Dropzone } from "./FileUpload";
import TagsInput from "./util/TagsInput";
import { PostLocationForm } from "./PostLocationForm";
import { ImageList } from "./ImageList";
import {
  Paper,
  TextField,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import { Description } from "./Post/Description";
import { validatePost } from "./Post/validation";
import { makeStyles } from "@material-ui/styles";
import { PlaceAutocomplete } from "./Location/PlaceAutocomplete";
import { usePosition } from "../hooks/usePosition";
import { getLatLngFromAddress } from "./Location/geocoding";
const useStyles = makeStyles(theme => ({
  errorText: {
    color: theme.palette.error.main
  },
  main: {
    height: "calc(100vh - 56px)"
  },
  postForm: {
    height: "100%"
  }
}));

const CreatePost = () => {
  const [images, setImages] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [description, setDescription] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [address, onAddressChange] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [priceInfo, setPriceInfo] = React.useState("Fixed");

  const [createPost, { loading, error }] = useMutation(CREATE_POST);
  const [validationErrors, setErrors] = React.useState([]);
  const classes = useStyles();
  const { latitude, longitude } = usePosition();

  if (loading) return "Loading...";
  if (error) {
    return <div>{error.message}</div>;
  }

  const onDrop = urls => {
    const updatedImages = [...images, ...urls];
    setImages(updatedImages);
  };

  const onSubmit = async e => {
    e.preventDefault();
    setErrors([]);
    const latlng = await getLatLngFromAddress(address);
    const variables = {
      title,
      priceInfo,
      price: +price,
      description,
      images,
      tags,
      address,
      longitude,
      latitude
    };
    if (latlng) {
      variables.longitude = latlng.longitude;
      variables.latitude = latlng.latitude;
    }
    const { valid, errors } = validatePost(variables);
    if (!valid) {
      setErrors(errors);
    } else {
      createPost({
        variables
      });
    }
  };
  return (
    <Paper className={classes.main}>
      <Box height="100%">
        <form onSubmit={onSubmit} className={classes.postForm}>
          <Box padding="16px">
            <Box display="flex" flexDirection="column">
              {validationErrors.map((error, idx) => (
                <Typography
                  variant="caption"
                  className={classes.errorText}
                  key={`error-${idx}`}
                >
                  {error}
                </Typography>
              ))}
            </Box>
            <Box mb="16px">
              <TextField
                type="text"
                label="Title"
                name="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                fullWidth
                inputProps={{
                  maxLength: 120,
                  minLength: 12
                }}
              />
            </Box>
            <Box mb="16px">
              <Description
                value={description}
                onChange={setDescription}
                limit={2000}
              />
            </Box>
            <Box mb="16px" display="flex">
              <FormControl>
                <InputLabel id="price-info">Price</InputLabel>
                <Select
                  labelId="price-info"
                  id="price-info-select"
                  value={priceInfo}
                  onChange={e => {
                    setPriceInfo(e.target.value);
                  }}
                >
                  <MenuItem value={"Fixed"}>Fixed</MenuItem>
                  <MenuItem value={"Contact for price"}>
                    Contact for price
                  </MenuItem>
                </Select>
              </FormControl>
              {priceInfo === "Fixed" && (
                <Box ml="8px">
                  <TextField
                    type="number"
                    label="Enter price"
                    name="price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    fullWidth
                    inputProps={{
                      step: 0.01
                    }}
                  />
                </Box>
              )}
            </Box>
            <Box mb="16px">
              <PlaceAutocomplete onChange={onAddressChange} value={address} />
            </Box>
            <Box mb="16px">
              <TagsInput
                onChange={tags => {
                  setTags(tags);
                }}
                onAdd={tag => {
                  const tTags = [...tags, tag];
                  setTags(tTags);
                }}
                tags={tags}
              />
            </Box>
            <Box mb="16px">
              <Dropzone
                onFileDrop={onDrop}
                limit={12}
                currentCount={images.length}
                images={images}
              />
              <ImageList imagesUrls={images} />
            </Box>
          </Box>
          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Submit
          </Button>
          {/* <PostLocationForm /> */}
        </form>
      </Box>
    </Paper>
  );
};

export default CreatePost;
