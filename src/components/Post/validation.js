export const validatePost = ({
  title,
  description,
  tags,
  images,
  address,
  priceInfo,
  price,
  latitude,
  longitude
}) => {
  let errors = {};
  if (
    !title ||
    title.trim() == "" ||
    title.trim().length > 70 ||
    title.trim().length < 7
  ) {
    errors["title"] = "Missing title";
  }
  if (!description || description.trim() == "") {
    errors["description"] = "Missing description";
  }

  if (!tags || tags.length < 1) {
    errors["tags"] = "Please add at least one tag";
  }

  if (!address || address === "") {
    errors["address"] = "Please add your City or Postal Code";
  } else if (!latitude || !longitude) {
    errors["latitude-longitude"] = "Please enter a valid address";
  }

  if (!images || images.length == 0) {
    errors["images"] = "Please add at least one images";
  }
  if (priceInfo == "Fixed" && (!price || price == 0)) {
    errors["price"] = "Please enter price";
  }
  return { valid: Object.keys(errors).length == 0, errors };
};
