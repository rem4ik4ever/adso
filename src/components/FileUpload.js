import React from "react";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@material-ui/styles";
import { Typography, Box } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import TouchAppIcon from "@material-ui/icons/TouchApp";
import RootRef from "@material-ui/core/RootRef";
import { SIGN_S3 } from "../graphql/postResolvers";
import { uploadToS3, formatFilename } from "../utils/fileHelper";
import { useMutation } from "@apollo/react-hooks";

const useStyles = makeStyles(theme => ({
  dropzone: {
    border: "1px solid #ccc",
    textAlign: "center",
    borderStyle: "dashed",
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    cursor: "pointer"
  }
}));

export function Dropzone({ onFileDrop }) {
  const [signS3] = useMutation(SIGN_S3, {
    onCompleted: async data => {
      const { signS3 } = data;
      await uploadToS3(acceptedFiles[0], signS3.signedRequest);
      onFileDrop(signS3.url);
    }
  });
  const onDrop = React.useCallback(acceptedFiles => {
    signS3({
      variables: {
        filename: formatFilename(acceptedFiles[0].name),
        filetype: acceptedFiles[0].type
      }
    });
  }, []);
  const classes = useStyles();
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({ onDrop });
  const { ref, ...rootProps } = getRootProps();

  return (
    <RootRef rootRef={ref}>
      <>
        <div className={classes.dropzone} {...getRootProps()}>
          <input
            {...getInputProps({
              multiple: true
            })}
          />
          {isDragActive ? (
            <Box display="flex" alignItems="center" justifyContent="center">
              <AddPhotoAlternateIcon fontSize="large" />
              <Typography variant="subtitle1">
                Drop the files here ...
              </Typography>
            </Box>
          ) : (
            <Box display="flex" alignItems="center" justifyContent="center">
              <ImageIcon fontSize="large" />
              <Typography variant="subtitle1">
                Drag 'n' drop some files here, or
              </Typography>
              <TouchAppIcon />
              <Typography variant="subtitle1">to select files</Typography>
            </Box>
          )}
        </div>
      </>
    </RootRef>
  );
}
