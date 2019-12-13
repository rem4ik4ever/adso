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
  let errors = [];
  if (!title || title.trim() == "") {
    errors.push("Missing title");
  }
  if (!description || description.trim() == "") {
    errors.push("Missing description");
  }

  if (!tags || tags.length < 1) {
    errors.push("Please add at least one tag");
  }

  if (!address || address === "") {
    errors.push("Please add your City or Postal Code");
  } else if (!latitude || !longitude) {
    errors.push("Please enter a valid address");
  }

  if (!images || images.length == 0) {
    errors.push("Please add at least one images");
  }
  if (priceInfo == "Fixed" && (!price || price == 0)) {
    errors.push("Please enter price");
  }
  return { valid: errors.length == 0, errors };
};
