import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Box, Fab } from "@material-ui/core";
import clsx from "clsx";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import ArrowRight from "@material-ui/icons/ArrowRight";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import posed from "react-pose";

const Overlay = posed.div({
  hidden: { opacity: 0, width: 0 },
  visible: { opacity: 1, width: "100%" }
});

const useStyles = makeStyles(theme => ({
  container: {
    transition: "box-shadow 200ms ease-in-out",
    border: "1px solid #dedede",
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    position: "relative"
  },
  thumbnail: {
    maxWidth: "160px",
    maxHeight: "160px"
  },
  blur: {
    filter: "blur(2px)"
  },
  selected: {
    boxShadow: `0 0 8px ${theme.palette.secondary.main}`
  },
  overlay: {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute"
  }
}));
// const urls = [
//   "https://adso-bucket.s3.amazonaws.com/images-tmp-fld/20191212-0b358d81-5fc0-4c27-8765-bc2023a25740",
//   "https://adso-bucket.s3.amazonaws.com/images-tmp-fld/20191212-14826d06-8d05-4f90-a8ee-352cb1140a81",
//   "https://adso-bucket.s3.amazonaws.com/images-tmp-fld/20191212-d854c7ba-7df7-4cea-b1a5-a612a96cf5ff",
//   "https://adso-bucket.s3.amazonaws.com/images-tmp-fld/20191212-f26cc803-9beb-419e-a20a-0490075bbe0b",
//   "https://adso-bucket.s3.amazonaws.com/images-tmp-fld/20191212-ec3d2270-5e77-418b-be2d-2cea5c242293"
// ];
export const ImageList = ({ imagesUrls, onChange }) => {
  // const [imagesUrls, setUrls] = React.useState(urls);
  const classes = useStyles();
  const [selected, setSelected] = React.useState(null);

  const handleDelete = (e, index) => {
    e.preventDefault();
    console.log("should delete");
    onChange([
      ...imagesUrls.slice(0, index),
      ...imagesUrls.slice(index + 1, imagesUrls.length)
    ]);
  };

  const handleSwap = (e, index, direction) => {
    e.preventDefault();
    const newList = [...imagesUrls];
    const newIndex = (index + direction) % imagesUrls.length;
    const item1 = newList[index];
    const item2 = newList[newIndex];
    newList[index] = item2;
    newList[newIndex] = item1;
    onChange(newList);
  };

  return (
    <Box display="flex" overflow="auto">
      {imagesUrls.map((url, index) => (
        <Box
          className={clsx(classes.container, [
            selected === url && classes.selected
          ])}
          onClick={e => {
            e.preventDefault();

            if (!selected || selected !== url) {
              setSelected(url);
            } else {
              setSelected(null);
            }
          }}
          key={`img-${index}`}
        >
          <Box>
            <img
              className={clsx(classes.thumbnail, [
                selected === url && classes.blur
              ])}
              src={url}
            />
          </Box>
          <Overlay pose={selected == url ? "visible" : "hidden"}>
            <Box className={classes.overlay}>
              <Fab
                size="small"
                onClick={e => {
                  if (selected == url) {
                    handleSwap(e, index, -1);
                  }
                }}
              >
                <ArrowLeft />
              </Fab>
              <Fab
                size="small"
                color="secondary"
                onClick={e => {
                  if (selected == url) {
                    handleDelete(e, index);
                  }
                }}
              >
                <DeleteForeverIcon />
              </Fab>
              <Fab
                size="small"
                onClick={e => {
                  if (selected == url) {
                    handleSwap(e, index, 1);
                  }
                }}
              >
                <ArrowRight />
              </Fab>
            </Box>
          </Overlay>
        </Box>
      ))}
    </Box>
  );
};
