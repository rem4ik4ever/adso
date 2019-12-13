import React from "react";
import { Editor, EditorState, convertFromHTML, ContentState } from "draft-js";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { stateToHTML } from "draft-js-export-html";

const useStyles = makeStyles(theme => ({
  description: {
    border: "1px solid #ccc",
    padding: theme.spacing(1),
    minHeight: "120px",
    maxHeight: "120px",
    borderRadius: "6px",
    overflow: "auto"
  }
}));

const convert = sampleMarkup => {
  const blocksFromHTML = convertFromHTML(sampleMarkup);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );
  return state;
};

export const Description = ({ value, onChange, limit = 2000 }) => {
  const classes = useStyles();
  const editorRef = React.createRef();
  const [editorState, setState] = React.useState(
    EditorState.createWithContent(convert(value))
  );

  const change = editState => {
    const contentState = editState.getCurrentContent();
    const oldContent = editorState.getCurrentContent();
    if (
      contentState === oldContent ||
      contentState.getPlainText().length <= limit
    ) {
      setState(editState);
      const html = stateToHTML(editState.getCurrentContent());
      onChange(html);
    } else {
      const editState = EditorState.undo(
        EditorState.push(
          editorState,
          ContentState.createFromText(oldContent.getPlainText()),
          "delete-character"
        )
      );
      setState(editState);
      const html = stateToHTML(editState.getCurrentContent());
      onChange(html);
    }
  };

  const onClick = () => {
    editorRef.current.focus();
  };
  return (
    <Box>
      <Typography variant="subtitle1">Description: </Typography>
      <Box className={classes.description} onClick={onClick}>
        <Editor editorState={editorState} onChange={change} ref={editorRef} />
      </Box>
    </Box>
  );
};
