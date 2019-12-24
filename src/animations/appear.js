import posed, { PoseGroup } from "react-pose";

export const Appear = posed.div({
  enter: {
    y: 0,
    opacity: 1,
    delay: ({ i }) => 300 + i * 50,
    transition: {
      default: { duration: 300 }
    }
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: { duration: 150 }
  }
});
