import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_POST } from "../graphql/postResolvers";
import { Dropzone } from "./FileUpload";
import TagsInput from "./util/TagsInput";
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
  MenuItem,
  Container,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from "@material-ui/core";
import { Description } from "./Post/Description";
import { validatePost } from "./Post/validation";
import { makeStyles } from "@material-ui/styles";
import { PlaceAutocomplete } from "./Location/PlaceAutocomplete";
import { usePosition } from "../hooks/usePosition";
import { getLatLngFromAddress } from "./Location/geocoding";
import InfoIcon from "@material-ui/icons/Info";
import PostComplete from "./Post/PostComplete";
import { useRouter } from "next/router";

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
  }
}));

const CreatePost = () => {
  const router = useRouter();
  const [images, setImages] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [description, setDescription] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [address, onAddressChange] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [priceInfo, setPriceInfo] = React.useState("Fixed");
  const [isSubmitting, setSubmitting] = React.useState(false);
  const [isCompleted, setCompleted] = React.useState(false);

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    onCompleted: data => {
      setCompleted(true);
      setTimeout(() => {
        router.push(`/p?id=${data.createPost.uuid}`);
      }, 2000);
    },
    onError: err => {
      console.error(err);
    }
  });
  const [validationErrors, setErrors] = React.useState([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const classes = useStyles();
  const { latitude, longitude } = usePosition();

  // if (loading) return "Loading...";
  // if (error) {
  //   return <div>{error.message}</div>;
  // }

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
      setSubmitting(true);
      createPost({
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
        const { errors } = validatePost({ title });
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
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            inputProps={{
              maxLength: 70,
              minLength: 12
            }}
          />
          <Typography variant="caption">{title.length} / 70</Typography>
        </Box>
      )
    },
    {
      label: "Add description",
      field: "description",
      isValid: () => {
        const { errors } = validatePost({ description });
        if (errors["description"]) {
          return false;
        }
        return true;
      },
      description: "Provide details and information about it",
      component: () => (
        <Description
          value={description}
          onChange={setDescription}
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
        const { errors } = validatePost({ price, priceInfo });
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
              value={priceInfo}
              onChange={e => {
                setPriceInfo(e.target.value);
              }}
            >
              <MenuItem value={"Fixed"}>Fixed</MenuItem>
              <MenuItem value={"Contact for price"}>Contact for price</MenuItem>
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
      )
    },
    {
      label: "Where would you like to meet?",
      description:
        "Home? Mall? Moon? pick a place where you feel comfortable to meet",
      field: "address",
      isValid: () => {
        const { errors } = validatePost({ address });
        if (errors["address"]) {
          return false;
        }
        return true;
      },
      component: () => (
        <Box mt={1}>
          <PlaceAutocomplete onChange={onAddressChange} value={address} />
        </Box>
      )
    },
    {
      label: "Add some tags",
      description:
        "This will help other people to find you Ad. Don't be shy add some tags!",
      field: "tags",
      isValid: () => {
        const { errors } = validatePost({ tags });
        if (errors["tags"]) {
          return false;
        }
        return true;
      },
      component: () => (
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
      )
    },
    {
      label: "Upload images",
      description:
        "Make sure you use high quality images. People like to see images with good light and sharp details",
      field: "images",
      isValid: () => {
        const { errors } = validatePost({ images });
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
            currentCount={images.length}
            images={images}
          />
          <ImageList imagesUrls={images} onChange={setImages} />
        </Box>
      )
    }
  ];

  const handleNext = e => {
    e.preventDefault();
    setActiveStep(activeStep => activeStep + 1);
  };

  const handleBack = e => {
    e.preventDefault();
    setActiveStep(activeStep => activeStep - 1);
  };

  if (isSubmitting) {
    return <PostComplete complete={isCompleted} />;
  }
  return (
    <Container maxWidth="md">
      <Paper className={classes.main}>
        <Box height="100%">
          <form onSubmit={onSubmit} className={classes.postForm}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => {
                return (
                  <Step key={index}>
                    <StepLabel>{step.label}</StepLabel>
                    <StepContent>
                      <div className={classes.stepDescription}>
                        <InfoIcon className={classes.descriptionIcon} />
                        {step.description}
                      </div>
                      <Box>{step.component()}</Box>
                      <Box mt={1} textAlign="end">
                        {activeStep !== 0 && (
                          <Button
                            type="button"
                            variant="text"
                            onClick={handleBack}
                            tabIndex={-1}
                          >
                            Back
                          </Button>
                        )}
                        {activeStep == steps.length - 1 ? (
                          <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            fullWidth
                            disabled={!step.isValid()}
                          >
                            post
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outlined"
                            onClick={handleNext}
                            color="primary"
                            disabled={!step.isValid()}
                          >
                            Next
                          </Button>
                        )}
                      </Box>
                    </StepContent>
                  </Step>
                );
              })}
            </Stepper>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePost;
