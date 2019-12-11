import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_POST } from "../graphql/postResolvers";
import { Dropzone } from "./FileUpload";
import TagsInput from "./util/TagsInput";
import { PostLocationForm } from "./PostLocationForm";
import { ImageList } from "./ImageList";
import { Paper, TextField, Typography, Box, Button } from "@material-ui/core";
import { Description } from "./Post/Description";
import { validatePost } from "./Post/validation";
import { makeStyles } from "@material-ui/styles";
import { PlaceAutocomplete } from "./Location/PlaceAutocomplete";
import { usePosition } from "../hooks/usePosition";

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
  const [address, onAddressChange] = React.useState("");
  const [createPost, { loading, error }] = useMutation(CREATE_POST);
  const [validationErrors, setErrors] = React.useState([]);
  const formRef = React.createRef();
  const classes = useStyles();
  const { longitude, latitude } = usePosition();

  if (loading) return "Loading...";
  if (error) {
    return <div>{error.message}</div>;
  }

  const onDrop = urls => {
    const updatedImages = [...images, ...urls];
    setImages(updatedImages);
  };
  const onSubmit = e => {
    e.preventDefault();
    const variables = {
      title: formRef.current.title.value,
      description,
      images,
      tags,
      address,
      longitude,
      latitude
    };
    console.log(variables);
    const { valid, errors } = validatePost(variables);
    if (!valid) {
      setErrors(errors);
    } else {
      // createPost({
      //   variables
      // });
    }
  };
  return (
    <Paper className={classes.main}>
      <Box height="100%">
        <form onSubmit={onSubmit} ref={formRef} className={classes.postForm}>
          <Box display="flex" flexDirection="column" height="100%">
            <Box padding="16px" flexGrow="1" overflow="auto">
              <Box display="flex" flexDirection="column">
                {validationErrors.map(error => (
                  <Typography variant="caption" className={classes.errorText}>
                    {error}
                  </Typography>
                ))}
              </Box>
              <Box mb="16px">
                <TextField type="text" label="Title" name="title" fullWidth />
              </Box>
              <Box mb="16px">
                <Description value={description} onChange={setDescription} />
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
                <Dropzone onFileDrop={onDrop} />
                <ImageList imagesUrls={images} />
              </Box>
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Box>
          {/* <PostLocationForm /> */}
        </form>
      </Box>
    </Paper>
  );
};

export default CreatePost;
