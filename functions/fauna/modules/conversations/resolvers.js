const faunadb = require("faunadb");
const uuidv4 = require("uuid/v4");
const moment = require("moment");
const {
  getHeaderJWT,
  verifyAccessToken
} = require("../authentication/utils/auth");
const { currentUser } = require("../authentication/user/search");
const { client } = require("../../db/utils");
const q = faunadb.query;

const getConversation = async (_, { postId }, { headers }) => {
  let user = null;
  try {
    user = await currentUser(headers);
  } catch (error) {
    return null;
  }

  // Conversation by postid and participantId
  // const { data } = await client.query(q.Get(q.Match(q.Index())));
};

const myConversations = async (_, _args, { headers }) => {
  let user = null;
  try {
    user = await currentUser(headers);
  } catch (error) {
    return null;
  }
};

const createConversation = async (_, { postId }, { headers }) => {
  try {
    let user = null;
    user = await currentUser(headers);
    const now = moment().format("x");
    const conversation = {
      id: uuidv4(),
      postId,
      active: true,
      createdAt: now
    };

    const { data } = await client.query(
      q.Create(q.Ref("classes/conversations"), conversation)
    );

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = {
  Query: {
    myConversations,
    getConversation
  },
  Mutation: {
    createConversation
  }
};
