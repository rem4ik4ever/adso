const faunadb = require("faunadb");
const uuidv4 = require("uuid/v4");

const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
});

const createPost = async (_, { title, description }, _context) => {
  try {
    const post = { data: { uuid: uuidv4(), title, description } };
    await client.query(q.Create(q.Ref("classes/posts"), post));
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

const allPosts = async (_, _args, _context) => {
  try {
    const response = await client.query(
      q.Paginate(q.Match(q.Ref("indexes/all_posts")))
    );
    const itemsRefs = response.data;
    const allItemsDataQuery = itemsRefs.map(ref => q.Get(ref));
    const items = await client.query(allItemsDataQuery);
    return items.map(item => {
      return item.data;
    });
  } catch (err) {
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

module.exports = {
  Query: {
    allPosts: (root, args, context) => allPosts(root, args, context)
  },
  Mutation: {
    createPost: async (root, args, context) => createPost(root, args, context),
    updatePost: async (root, args, context) => updatePost(root, args, context),
    deletePost: async (root, args, context) => deletePost(root, args, context)
  }
};
