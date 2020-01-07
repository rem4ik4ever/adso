import React from "react";
import { Box, Button } from "@material-ui/core";
import Link from "next/link";

function useHookWithRefCallback() {
  const [height, setState] = React.useState(0);
  const ref = React.useRef(null);
  const setRef = React.useCallback(node => {
    if (ref.current) {
      // Make sure to cleanup any events/references added to the last instance
      setState(0);
    }

    if (node) {
      setState(node.clientHeight);
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
    }

    // Save a reference to the node
    ref.current = node;
  }, []);

  return [setRef, height];
}

const PostDescription = ({ id, content, trimHeight }) => {
  const [descriptionRef, height] = useHookWithRefCallback();
  console.log("Heright", height);
  return (
    <div>
      <Box
        maxHeight={trimHeight}
        overflow="hidden"
        ref={descriptionRef}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {height >= trimHeight && (
        <Link href={`/p?id=${id}`}>
          <Button>Read more</Button>
        </Link>
      )}
    </div>
  );
};

export default PostDescription;
