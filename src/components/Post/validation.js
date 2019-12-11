export const validatePost = ({
  title,
  description,
  tags,
  address,
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
    errors.push("At least one tag is requried");
  }

  if (!address && !latitude && !longitude) {
    errors.push("Please add your City or Postal Code");
  }
  return { valid: errors.length == 0, errors };
};
