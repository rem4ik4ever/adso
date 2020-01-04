import React from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  CREATE_POST,
  UPDATE_POST,
  GET_POST
} from "../../graphql/postResolvers";
import { Dropzone } from "../FileUpload";
import TagsInput from "../util/TagsInput";
import { ImageList } from "../ImageList";
import {
  Paper,
  TextField,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from "@material-ui/core";
import { Description } from "../Post/Description";
import { validatePost } from "../Post/validation";
import { makeStyles } from "@material-ui/styles";
import { PlaceAutocomplete } from "../Location/PlaceAutocomplete";
import { usePosition } from "../../hooks/usePosition";
import { getLatLngFromAddress } from "../Location/geocoding";
import { Save, Delete } from "@material-ui/icons";
import PostComplete from "../Post/PostComplete";
import { useRouter } from "next/router";
import Section from "./Section";

const useStyles = makeStyles(theme => ({
  errorText: {
    color: theme.palette.error.main
  },
  main: {
    marginTop: theme.spacing(1)
  },
  postForm: {
    height: "100%"
  },
  stepDescription: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "8px",
    backgroundColor: "aliceblue",
    color: "#565656",
    fontSize: "0.75rem"
  },
  descriptionIcon: {
    color: "cadetblue",
    margin: theme.spacing(1)
  },
  deleteBtn: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.white,
    marginRight: theme.spacing(1)
  }
}));

const PostEditForm = ({ post }) => {
  const router = useRouter();
  const [postToEdit, setState] = React.useState({ ...post });
  const [isSubmitting, setSubmitting] = React.useState(false);
  const [isCompleted, setCompleted] = React.useState(false);
  const handleChange = (field, val) => {
    setState({ ...postToEdit, [field]: val });
  };

  const [updatePost, { loading, error }] = useMutation(UPDATE_POST, {
    onCompleted: data => {
      setCompleted(true);
      setTimeout(() => {
        setSubmitting(false);
        // router.push(`/p?id=${data.updatePost.uuid}`);
      }, 2000);
    },
    onError: err => {
      console.error(err);
    },
    update: (cache, { data }) => {
      console.log("Ca", cache);
      console.log("trying update cached", data);
      const { updatePost } = data;
      try {
        let { getPost } = cache.readQuery({
          query: GET_POST,
          variables: { id: updatePost.uuid }
        });
        console.log("GetPOST", getPost);
        cache.writeQuery({
          query: GET_POST,
          data: {
            getPost: {
              ...updatePost,
              author: getPost.author
            }
          }
        });
        console.log(cache);
      } catch (e) {
        console.log("EE", e);
        // We should always catch here,
        // as the cache may be empty or the query may fail
      }
    }
  });
  const [validationErrors, setErrors] = React.useState([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const classes = useStyles();
  const { latitude, longitude } = usePosition();

  // if (loading) return "Loading...";
  if (error) {
    if (isSubmitting) {
      setSubmitting(false);
    }
    return (
      <Box mt={2} textAlign="center">
        <Typography className={classes.errorText}>
          Sorry something went wrong. Please try again
        </Typography>
        <Button
          onClick={e => {
            location.reload();
          }}
        >
          Reload
        </Button>
      </Box>
    );
  }

  const onDrop = urls => {
    const updatedImages = [...postToEdit.images, ...urls];
    handleChange("images", updatedImages);
  };

  const onSubmit = async e => {
    e.preventDefault();
    setErrors([]);
    const latlng = await getLatLngFromAddress(postToEdit.address);
    const variables = {
      ...postToEdit,
      id: post.uuid,
      price: +postToEdit.price
    };
    if (latlng) {
      variables.longitude = latlng.longitude;
      variables.latitude = latlng.latitude;
    }
    const { valid, errors } = validatePost(variables);
    console.log("Submitting", valid, errors, variables);
    if (!valid) {
      setErrors(errors);
      window.scrollTo(0, 0);
    } else {
      setSubmitting(true);
      updatePost({
        variables
      });
    }
  };
  const steps = [
    {
      label: "What are you offering?",
      description: "Good titile is half of the success!",
      field: "title",
      isValid: () => {
        const { errors } = validatePost({ title: postToEdit.title });
        if (errors["title"]) {
          return false;
        }
        return true;
      },
      component: () => (
        <Box mt={1}>
          <TextField
            type="text"
            label="Title"
            name="title"
            value={postToEdit.title}
            onChange={e => handleChange("title", e.target.value)}
            fullWidth
            inputProps={{
              maxLength: 70,
              minLength: 12
            }}
          />
          <Typography variant="caption">
            {postToEdit.title.length} / 70
          </Typography>
        </Box>
      )
    },
    {
      label: "Add description",
      field: "description",
      isValid: () => {
        const { errors } = validatePost({
          description: postToEdit.description
        });
        if (errors["description"]) {
          return false;
        }
        return true;
      },
      description: "Provide details and information about it",
      component: () => (
        <Description
          value={postToEdit.description}
          onChange={val => handleChange("description", val)}
          limit={2000}
        />
      )
    },
    {
      label: "How much you ask?",
      description:
        "If you know how much you want set Fixed price if you want to negotiate set 'Contact for price'",
      field: "price",
      isValid: () => {
        const { errors } = validatePost({
          price: postToEdit.price,
          priceInfo: postToEdit.priceInfo
        });
        if (errors["price"]) {
          return false;
        }
        return true;
      },
      component: () => (
        <Box display="flex" mt={1}>
          <FormControl>
            <InputLabel id="price-info">Price</InputLabel>
            <Select
              labelId="price-info"
              id="price-info-select"
              value={postToEdit.priceInfo}
              onChange={e => {
                handleChange("price-info", e.target.value);
              }}
            >
              <MenuItem value={"Fixed"}>Fixed</MenuItem>
              <MenuItem value={"Contact for price"}>Contact for price</MenuItem>
            </Select>
          </FormControl>
          {postToEdit.priceInfo === "Fixed" && (
            <Box ml="8px">
              <TextField
                type="number"
                label="Enter price"
                name="price"
                value={postToEdit.price}
                onChange={e => handleChange("price", e.target.value)}
                fullWidth
                inputProps={{
                  step: 0.01
                }}
              />
            </Box>
          )}
        </Box>
      )
    },
    {
      label: "Where would you like to meet?",
      description:
        "Home? Mall? Moon? pick a place where you feel comfortable to meet",
      field: "address",
      isValid: () => {
        const { errors } = validatePost({ address: postToEdit.address });
        if (errors["address"]) {
          return false;
        }
        return true;
      },
      component: () => (
        <Box mt={1}>
          <PlaceAutocomplete
            onChange={val => handleChange("address", val)}
            value={postToEdit.address}
          />
        </Box>
      )
    },
    {
      label: "Add some tags",
      description:
        "This will help other people to find you Ad. Don't be shy add some tags!",
      field: "tags",
      isValid: () => {
        const { errors } = validatePost({ tags: postToEdit.tags });
        if (errors["tags"]) {
          return false;
        }
        return true;
      },
      component: () => (
        <TagsInput
          onChange={tags => {
            handleChange("tags", tags);
          }}
          onAdd={tag => {
            const tTags = [...postToEdit.tags, tag];
            handleChange("tags", tTags);
          }}
          tags={postToEdit.tags}
        />
      )
    },
    {
      label: "Upload images",
      description:
        "Make sure you use high quality images. People like to see images with good light and sharp details",
      field: "images",
      isValid: () => {
        const { errors } = validatePost({ images: postToEdit.images });
        if (errors["images"]) {
          return false;
        }
        return true;
      },
      component: () => (
        <Box mt={1}>
          <Dropzone
            onFileDrop={onDrop}
            limit={12}
            currentCount={postToEdit.images.length}
            images={postToEdit.images}
          />
          <ImageList
            imagesUrls={postToEdit.images}
            onChange={val => handleChange("images", val)}
          />
        </Box>
      )
    }
  ];

  if (isSubmitting) {
    return <PostComplete complete={isCompleted} />;
  }
  return (
    <Container maxWidth="md">
      <Box height="100%">
        <Box my={1}>
          {Object.keys(validationErrors).map((prop, index) => (
            <Typography className={classes.errorText} key={`err-${index}`}>
              {validationErrors[prop]}
            </Typography>
          ))}
        </Box>
        <form onSubmit={onSubmit} className={classes.postForm}>
          {steps.map((step, index) => {
            return (
              <Box my={1} key={index}>
                <Section label={step.label}>{step.component()}</Section>
              </Box>
            );
          })}
          <Box my={1}>
            <Section>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="button"
                  variant="outlined"
                  className={classes.deleteBtn}
                  startIcon={<Delete />}
                >
                  Delete
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                >
                  Save
                </Button>
              </Box>
            </Section>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default PostEditForm;
