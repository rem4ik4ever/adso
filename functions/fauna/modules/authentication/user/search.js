const faunadb = require("faunadb");

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
    return false;
  }
};

module.exports = {
  findByEmail,
  findByConfirmationToken,
  findByUUID
};
