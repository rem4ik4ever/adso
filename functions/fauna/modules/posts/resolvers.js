const faunadb = require("faunadb");
const uuidv4 = require("uuid/v4");
const moment = require("moment");
const {
  getHeaderJWT,
  verifyAccessToken
} = require("../authentication/utils/auth");
const AWS = require("aws-sdk");

const q = faunadb.query;

const { client } = require("../../db/utils");

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
        uuid: uuidv4(),
        title,
        description,
        authorId: payload.uuid,
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
      match = await client.query(
        q.Get(q.Match(q.Index("posts_by_uuid"), after))
      );
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
      after: afterObject ? afterObject.data.uuid : "",
      before: beforeObject ? beforeObject.data.uuid : "",
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

const updatePost = async (_, { id, title, description }, _context) => {
  try {
    const data = { title, description };
    const match = await client.query(
      q.Get(q.Match(q.Index("posts_by_uuid"), id))
    );
    await client.query(q.Update(q.Ref(match.ref), { data }));
  } catch (err) {
    return false;
  }
  return true;
};

const deletePost = async (_, { id }, _context) => {
  try {
    const match = await client.query(
      q.Get(q.Match(q.Index("posts_by_uuid"), id))
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
    q.Get(q.Match(q.Index("posts_by_uuid"), id))
  );
  const author = await client.query(
    q.Get(q.Match(q.Index("user_by_uuid"), data.authorId))
  );
  return {
    ...data,
    author: author.data
  };
};

module.exports = {
  Query: {
    allPosts: (root, args, context) => allPosts(root, args, context),
    getPost
  },
  Mutation: {
    createPost: async (root, args, context) => createPost(root, args, context),
    updatePost: async (root, args, context) => updatePost(root, args, context),
    deletePost: async (root, args, context) => deletePost(root, args, context),
    signS3
  }
};
