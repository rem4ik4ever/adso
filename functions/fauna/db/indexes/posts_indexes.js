const allPosts = {
  name: "all_posts",
  create: true,
  update: true,
  params: {
    source: "posts"
  }
};

const postByUuid = {
  name: "posts_by_uuid",
  create: true,
  update: true,
  params: {
    source: "posts",
    unique: true,
    serialized: true,
    source: "posts",
    terms: [
      {
        field: ["data", "uuid"]
      }
    ]
  }
};

const postById = {
  name: "posts_by_id",
  create: true,
  update: true,
  params: {
    source: "posts",
    unique: true,
    serialized: true,
    source: "posts",
    terms: [
      {
        field: ["data", "id"]
      }
    ]
  }
};

const postsByCreatedAt = {
  name: "posts_by_created_at_desc",
  create: true,
  update: true,
  params: {
    serialized: true,
    source: "posts",
    values: [
      {
        field: ["data", "createdAt"],
        reverse: true
      },
      {
        field: ["ref"]
      }
    ]
  }
};

module.exports = [allPosts, postByUuid, postsByCreatedAt, postById];
