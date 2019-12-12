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
    padding: theme.spacing(2),
    cursor: "pointer"
  }
}));

export function Dropzone({ onFileDrop }) {
  const [signS3] = useMutation(SIGN_S3);

  const uploadFiles = async acceptedFiles => {
    return new Promise(async (resolve, _reject) => {
      const uploads = acceptedFiles.map(async file => {
        return new Promise(async (resolve, _reject) => {
          const upload = await signS3({
            variables: {
              filename: formatFilename(file.name),
              filetype: file.type
            }
          });
          await uploadToS3(file, upload.data.signS3.signedRequest);
          resolve(upload.data.signS3.url);
        });
      });
      Promise.all(uploads).then(values => {
        resolve(values);
      });
    });
  };
  const onDrop = React.useCallback(async acceptedFiles => {
    const urls = await uploadFiles(acceptedFiles);
    onFileDrop(urls);
  }, []);
  const classes = useStyles();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ["image/png", "image/jpeg"],
    maxSize: 20000000
  });
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
          <Box display={{ xs: "none", sm: "block" }}>
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
          </Box>
          <Box display={{ xs: "block", sm: "none" }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <TouchAppIcon />
              <Typography variant="subtitle1">
                click to upload images
              </Typography>
            </Box>
          </Box>
        </div>
      </>
    </RootRef>
  );
}
