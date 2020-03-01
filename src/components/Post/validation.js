export const validatePost = ({
  address,
  categoryId,
  description,
  images,
  latitude,
  longitude,
  price,
  priceInfo,
  tags,
  title,
  category
}) => {
  let errors = {};
  if (
    !title ||
    title.trim() == "" ||
    title.trim().length > 70 ||
    title.trim().length < 7
  ) {
    if (!title || title == "") {
      errors["title"] = "Missing title";
    } else if (title.trim().length < 7) {
      errors["title"] = "Title is too short";
    } else if (title.trim().length > 70) {
      errors["title"] = "Title is too long";
    }
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

  if (!categoryId && !category) {
    errors["categoryId"] = "Please select Category";
  }
  return { valid: Object.keys(errors).length == 0, errors };
};
