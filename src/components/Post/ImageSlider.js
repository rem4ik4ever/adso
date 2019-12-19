import React from "react";
import Slider from "react-slick";
import { makeStyles } from "@material-ui/styles";
import { Card, Box } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  card: {
    // margin: theme.spacing(1),
    top: "48px",
    position: "sticky"
  }
}));
const ImageSlider = ({ images }) => {
  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Slider {...settings}>
        {images.map((imageSrc, index) => (
          <img key={`img-${index}`} src={imageSrc} />
        ))}
      </Slider>
    </Card>
  );
};

export default ImageSlider;
