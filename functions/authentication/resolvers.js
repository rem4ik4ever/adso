const faunadb = require("faunadb");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const sendEmail = require("./utils/sendEmail");
const { findByEmail, findByConfirmationToken } = require("./user/search");

const { createAccessToken, createRefreshToken } = require("./utils/auth");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
});

const register = async (_, { data }, context) => {
  try {
    const exists = await findByEmail(client, data.email);
    if (exists) {
      return false;
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const confirmationToken = uuidv4();
    const userData = {
      data: {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        uuid: uuidv4(),
        password: hashedPassword,
        confirmationToken,
        confirmationValidUntil: moment()
          .add(1, "day")
          .format(),
        confirmed: false,
        active: true
      }
    };
    await client.query(q.Create(q.Ref("classes/users"), userData));
    await sendEmail(
      data.email,
      `http://localhost:8888/user/confirm/${confirmationToken}`
    );
  } catch (err) {
    return false;
  }
  return true;
};

const login = async (_, { data }, _context) => {
  try {
    const password = data.password;
    const email = data.email;
    const match = await client.query(
      q.Get(q.Match(q.Index("user_by_email"), email))
    );
    const user = match.data;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return null;
    }
    return {
      accessToken: createAccessToken(user),
      refreshToken: createRefreshToken(user)
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

const confirmUser = async (_, { token }, _context) => {
  try {
    const match = await findByConfirmationToken(client, token);
    if (!match) {
      console.error(`User with confirmationToken: ${token} not found`);
      return false;
    }
    const validUntil = moment(match.data.confirmationValidUntil);

    if (moment().isAfter(validUntil)) {
      console.error("Not valid anymore need to resend confirmation link");
      return false;
    }

    await client.query(
      q.Update(q.Ref(match.ref), {
        data: {
          confirmed: true
        }
      })
    );
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

module.exports = {
  Query: {
    me: () => null
  },
  Mutation: {
    register,
    login,
    confirmUser
  }
};
