const faunadb = require("faunadb");

const { verifyAccessToken } = require("../utils/auth");
const { client } = require("./../../../db/utils");

const q = faunadb.query;

const findByEmail = async (client, email) => {
  try {
    const exists = await client.query(
      q.Get(q.Match(q.Index("user_by_email"), email))
    );
    return exists;
  } catch (error) {
    return false;
  }
};

const findByConfirmationToken = async (client, token) => {
  try {
    const exists = await client.query(
      q.Get(q.Match(q.Index("user_by_confirmation_token"), token))
    );
    return exists;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const findByUUID = async (client, uuid) => {
  try {
    const exists = await client.query(
      q.Get(q.Match(q.Index("user_by_uuid"), uuid))
    );
    return exists;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const currentUser = async headers => {
  const authorization = headers.authorization;
  if (!authorization) return null;
  const token = authorization.split(" ")[1];
  const { uuid } = verifyAccessToken(token);
  const match = await findByUUID(client, uuid);
  return match.data;
};

module.exports = {
  currentUser,
  findByEmail,
  findByConfirmationToken,
  findByUUID
};
