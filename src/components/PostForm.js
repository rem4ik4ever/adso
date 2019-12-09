import React, { useEffect } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_POST, SIGN_S3 } from "../graphql/postResolvers";
import { formatFilename, uploadToS3 } from "../utils/fileHelper";
import { Dropzone } from "./FileUpload";
import { Typography, Box } from "@material-ui/core";
import TagsInput from "./util/TagsInput";
import { PostLocationForm } from "./PostLocationForm";
import { ImageList } from "./ImageList";

const CreatePost = () => {
  const [images, setImages] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [createPost, { data, loading, error }] = useMutation(CREATE_POST);

  const formRef = React.createRef();

  if (loading) return "Loading...";
  if (error) {
    console.log(error);
    return <div>{error.message}</div>;
  }

  const onDrop = urls => {
    const updatedImages = [...images, ...urls];
    setImages(updatedImages);
  };
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          createPost({
            variables: {
              title: formRef.current.title.value,
              description: formRef.current.description.value,
              images,
              tags
            }
          });
        }}
        ref={formRef}
      >
        <label>
          Title:
          <input type="text" name="title" />
        </label>
        <label>
          Description:
          <input type="text" name="description" />
        </label>
        <ImageList imagesUrls={images} />
        <Dropzone onFileDrop={onDrop} />
        <TagsInput
          onChange={tags => {
            console.log("Sliced tags", tags);
            setTags(tags);
          }}
          onAdd={tag => {
            const tTags = [...tags, tag];
            setTags(tTags);
          }}
          tags={tags}
        />
        <PostLocationForm />
        <input type="submit" label="Save" />
      </form>
    </div>
  );
};

export default CreatePost;
