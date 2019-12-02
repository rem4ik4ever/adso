import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $description: String!) {
    createPost(title: $title, description: $description)
  }
`;
const CreatePost = () => {
  const [createPost, { data, loading, error }] = useMutation(CREATE_POST);
  const formRef = React.createRef();
  if (loading) return "Loading...";
  if (error) {
    console.log(error);
    return <div>{error.message}</div>;
  }
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
    </div>
  );
};

export default CreatePost;
