import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_POST, SIGN_S3 } from "../graphql/postResolvers";
import { formatFilename, uploadToS3 } from "../utils/fileHelper";
import { Dropzone } from "./FileUpload";

const CreatePost = () => {
  const [image, setImage] = React.useState(null);
  const [createPost, { data, loading, error }] = useMutation(CREATE_POST);

  const [signS3] = useMutation(SIGN_S3, {
    onCompleted: async data => {
      console.log("signed", data);
      const { signS3 } = data;
      const result = await uploadToS3(image, signS3.signedRequest);
      console.log("Uploaded", result);
    }
  });
  const formRef = React.createRef();
  const imageRef = React.createRef();

  if (loading) return "Loading...";
  if (error) {
    console.log(error);
    return <div>{error.message}</div>;
  }

  const onDrop = files => {
    setImage(files[0]);
  };
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          createPost({
            variables: {
              title: formRef.current.title.value,
              description: formRef.current.description.value
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
        <input type="submit" label="Save" />
      </form>
      <form
        ref={imageRef}
        onSubmit={e => {
          e.preventDefault();

          signS3({
            variables: {
              filename: formatFilename(image.name),
              filetype: image.type
            }
          });
        }}
      >
        <Dropzone onFileDrop={onDrop} />
        <input type="submit" label="Upload" />
      </form>
    </div>
  );
};

export default CreatePost;
