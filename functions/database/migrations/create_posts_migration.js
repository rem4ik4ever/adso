module.exports.up = q => {
  return q.CreateCollection({ name: "Posts" });
};

module.exports.down = q => {
  return q.Delete(q.Collection("Posts"));
};
