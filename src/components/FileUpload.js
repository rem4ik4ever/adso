import React from "react";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@material-ui/styles";
import { Typography, Box } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import TouchAppIcon from "@material-ui/icons/TouchApp";
import RootRef from "@material-ui/core/RootRef";

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
  const onDrop = React.useCallback(acceptedFiles => {
    onFileDrop(acceptedFiles);
  }, []);
  const classes = useStyles();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const { ref, ...rootProps } = getRootProps();

  return (
    <RootRef rootRef={ref}>
      <div className={classes.dropzone} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <AddPhotoAlternateIcon fontSize="large" />
            <Typography variant="subtitle1">Drop the files here ...</Typography>
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
    </RootRef>
  );
}
