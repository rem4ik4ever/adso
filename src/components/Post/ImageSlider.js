import React from "react";
import Slider from "react-slick";
import { makeStyles } from "@material-ui/styles";
import { Card, Box } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  card: {
    // margin: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      top: 48
    },
    [theme.breakpoints.up("sm")]: {
      top: 48 + theme.spacing(1)
    },
    position: "sticky"
    // height: "fit-content"
  }
}));
const ImageSlider = ({ images, ...props }) => {
  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  const classes = useStyles();
  return (
    <Card {...props}>
      <Slider {...settings}>
        {images.map((imageSrc, index) => (
          <img key={`img-${index}`} src={imageSrc} />
        ))}
      </Slider>
    </Card>
  );
};

export default ImageSlider;
