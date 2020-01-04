const faunadb = require("faunadb");
const uuidv4 = require("uuid/v4");
const moment = require("moment");
const {
  getHeaderJWT,
  verifyAccessToken
} = require("../authentication/utils/auth");
const AWS = require("aws-sdk");

const { currentUser } = require("../authentication/user/search");

const q = faunadb.query;

const { client } = require("../../db/utils");
const {
  LocationDistanceQuery,
  QueryBySearchTerm,
  SearchByPriceRange,
  FlexSearchQuery,
  SearchByAuthor
} = require("./posts_fql");

const createPost = async (
  _,
  {
    title,
    description,
    tags,
    images,
    priceInfo,
    price,
    address,
    latitude,
    longitude
  },
  context
) => {
  try {
    const token = getHeaderJWT(context.headers.authorization);
    const payload = verifyAccessToken(token);
    const now = moment().format("x");
    const post = {
      data: {
        id: uuidv4(),
        title,
        description,
        authorId: payload.id,
        tags,
        images,
        priceInfo,
        price,
        address,
        latitude,
        longitude,
        active: true,
        createdAt: now,
        updatedAt: now
      }
    };
    const { data } = await client.query(q.Create(q.Ref("classes/posts"), post));
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const allPosts = async (_, { after, perPage }, _context) => {
  try {
    let opts = {
      size: perPage
    };
    let match = null;
    if (after) {
      match = await client.query(q.Get(q.Match(q.Index("posts_by_id"), after)));
      opts.after = match.data.createdAt;
    }
    const response = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index("posts_by_created_at_desc")), opts),
        q.Lambda(["createdAt", "ref"], q.Get(q.Var("ref")))
      )
    );
    let afterObject = null;
    let beforeObject = null;
    if (response.after && response.after[1]) {
      afterObject = await client.query(q.Get(response.after[1]));
    }
    if (response.before && response.before[1]) {
      beforeObject = await client.query(q.Get(response.before[1]));
    }
    return {
      after: afterObject ? afterObject.data.id : "",
      before: beforeObject ? beforeObject.data.id : "",
      data: response.data.map(item => {
        return item.data;
      }),
      perPage
    };
  } catch (err) {
    console.error(err);
    return [];
  }
};

const updatePost = async (
  _,
  {
    id,
    title,
    description,
    tags,
    images,
    priceInfo,
    price,
    address,
    latitude,
    longitude
  },
  _context
) => {
  try {
    const updateData = {
      title,
      description,
      tags,
      images,
      priceInfo,
      price,
      address,
      latitude,
      longitude,
      updatedAt: moment().format("x")
    };
    const match = await client.query(
      q.Get(q.Match(q.Index("posts_by_id"), id))
    );
    const { data } = await client.query(
      q.Update(q.Ref(match.ref), { data: updateData })
    );
    return data;
  } catch (err) {
    return null;
  }
};

const deletePost = async (_, { id }, _context) => {
  try {
    const match = await client.query(
      q.Get(q.Match(q.Index("posts_by_id"), id))
    );
    await client.query(q.Delete(q.Ref(match.ref)));
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

const s3Bucket = "adso-bucket";
const signS3 = async (_, { filename, filetype }, _context) => {
  const s3 = new AWS.S3({
    signatureVersion: "v4",
    region: "us-east-2",
    accessKeyId: process.env.ADSO_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.ADSO_AWS_SECRET_ACCESS_KEY
  });

  const s3Parms = {
    Bucket: s3Bucket,
    Key: filename,
    Expires: 60,
    ContentType: filetype,
    ACL: "public-read"
  };

  const signedRequest = await s3.getSignedUrl("putObject", s3Parms);
  const url = `https://${s3Bucket}.s3.amazonaws.com/${filename}`;

  return {
    signedRequest,
    url
  };
};

const getPost = async (_root, { id }, _context) => {
  const { data } = await client.query(
    q.Get(q.Match(q.Index("posts_by_id"), id))
  );
  const author = await client.query(
    q.Get(q.Match(q.Index("user_by_uuid"), data.authorId))
  );
  return {
    ...data,
    author: author.data
  };
};

const postsByLocation = async (
  _root,
  { latitude, longitude, distance, perPage, after },
  _context
) => {
  let opts = {
    size: perPage
  };
  let match = null;
  if (after) {
    match = await client.query(q.Get(q.Match(q.Index("posts_by_id"), after)));
    opts.after = match.data.createdAt;
  }
  const response = await client.query(
    LocationDistanceQuery(latitude, longitude, distance, opts)
  );
  let afterObject = null;
  let beforeObject = null;
  if (response.after && response.after[1]) {
    afterObject = await client.query(q.Get(response.after[1]));
  }
  if (response.before && response.before[1]) {
    beforeObject = await client.query(q.Get(response.before[1]));
  }
  const result = {
    after: afterObject ? afterObject.data.id : "",
    before: beforeObject ? beforeObject.data.id : "",
    data: response.data.map(item => {
      return item;
    }),
    perPage
  };
  return result;
};

const postsBySearchTerm = async (
  _root,
  { searchTerm, perPage, after },
  _context
) => {
  let opts = {
    size: perPage
  };
  let match = null;
  if (after) {
    match = await client.query(q.Get(q.Match(q.Index("posts_by_id"), after)));
    opts.after = match.data.createdAt;
  }
  const response = await client.query(QueryBySearchTerm(searchTerm, opts));
  let afterObject = null;
  let beforeObject = null;
  if (response.after && response.after[1]) {
    afterObject = await client.query(q.Get(response.after[1]));
  }
  if (response.before && response.before[1]) {
    beforeObject = await client.query(q.Get(response.before[1]));
  }
  const result = {
    after: afterObject ? afterObject.data.id : "",
    before: beforeObject ? beforeObject.data.id : "",
    data: response.data.map(item => {
      return item;
    }),
    perPage
  };
  return result;
};

const postsByPriceRange = async (
  _root,
  { fromPrice, toPrice, perPage, after },
  _context
) => {
  let opts = {
    size: perPage
  };
  let match = null;
  if (after) {
    match = await client.query(q.Get(q.Match(q.Index("posts_by_id"), after)));
    opts.after = match.data.createdAt;
  }
  const response = await client.query(
    SearchByPriceRange(fromPrice, toPrice, opts)
  );
  let afterObject = null;
  let beforeObject = null;
  if (response.after && response.after[1]) {
    afterObject = await client.query(q.Get(response.after[1]));
  }
  if (response.before && response.before[1]) {
    beforeObject = await client.query(q.Get(response.before[1]));
  }
  const result = {
    after: afterObject ? afterObject.data.id : "",
    before: beforeObject ? beforeObject.data.id : "",
    data: response.data.map(item => {
      return item;
    }),
    perPage
  };
  return result;
};

const postsByFlexSearch = async (
  _root,
  { searchTerm, location, priceRange, perPage, after },
  _context
) => {
  let opts = {
    size: perPage
  };
  let match = null;
  if (after) {
    match = await client.query(q.Get(q.Match(q.Index("posts_by_id"), after)));
    opts.after = match.data.createdAt;
  }
  const response = await client.query(
    FlexSearchQuery(searchTerm, location, priceRange, opts)
  );
  let afterObject = null;
  let beforeObject = null;
  if (response.after && response.after[1]) {
    afterObject = await client.query(q.Get(response.after[1]));
  }
  if (response.before && response.before[1]) {
    beforeObject = await client.query(q.Get(response.before[1]));
  }
  const result = {
    after: afterObject ? afterObject.data.id : "",
    before: beforeObject ? beforeObject.data.id : "",
    data: response.data.map(item => {
      return item;
    }),
    perPage
  };
  return result;
};

const myAds = async (_, { searchTerm = "", perPage, after }, { headers }) => {
  let user = null;
  try {
    user = await currentUser(headers);
  } catch (error) {
    return null;
  }

  let opts = {
    size: perPage
  };
  let match = null;
  if (after) {
    match = await client.query(q.Get(q.Match(q.Index("posts_by_id"), after)));
    opts.after = match.data.createdAt;
  }
  const response = await client.query(
    SearchByAuthor(user.uuid, searchTerm, opts)
  );
  let afterObject = null;
  let beforeObject = null;
  if (response.after && response.after[1]) {
    afterObject = await client.query(q.Get(response.after[1]));
  }
  if (response.before && response.before[1]) {
    beforeObject = await client.query(q.Get(response.before[1]));
  }
  const result = {
    after: afterObject ? afterObject.data.id : "",
    before: beforeObject ? beforeObject.data.id : "",
    data: response.data.map(item => {
      return item;
    }),
    perPage
  };
  return result;
};

module.exports = {
  Query: {
    allPosts: (root, args, context) => allPosts(root, args, context),
    getPost,
    postsByLocation,
    postsBySearchTerm,
    postsByPriceRange,
    postsByFlexSearch,
    myAds
  },
  Mutation: {
    createPost,
    updatePost,
    deletePost,
    signS3
  }
};
