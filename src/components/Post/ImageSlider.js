import React from "react";
import Slider from "react-slick";
import { makeStyles } from "@material-ui/styles";

const ImageSlider = ({ images }) => {
  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Slider {...settings}>
      {images.map((imageSrc, index) => (
        <img key={`img-${index}`} src={imageSrc} />
      ))}
    </Slider>
  );
};

export default ImageSlider;
