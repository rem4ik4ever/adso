const faunadb = require("faunadb");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const sendEmail = require("./utils/sendEmail");
const {
  findByEmail,
  findByConfirmationToken,
  findByUUID
} = require("./user/search");
const { client } = require("../../db/utils");
const cookie = require("cookie");

const {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} = require("./utils/auth");
const { AuthenticationError } = require("apollo-server-lambda");

const q = faunadb.query;

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
      `http://localhost:8888/confirm?token=${confirmationToken}`
    );
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

const login = async (_, { email, password }, _context) => {
  let match = null;
  try {
    match = await client.query(q.Get(q.Match(q.Index("user_by_email"), email)));
  } catch (err) {
    console.error(err);
    throw new AuthenticationError("Wrong email or password");
  }
  const user = match.data;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AuthenticationError("Wrong email or password");
  }
  return {
    accessToken: createAccessToken(user),
    refreshToken: createRefreshToken(user)
  };
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
          confirmed: true,
          confirmationToken: null,
          confirmationValidUntil: null
        }
      })
    );
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

const getCurrentUser = async (_, _args, { headers }) => {
  try {
    const authorization = headers.authorization;
    if (!authorization) return null;
    const token = authorization.split(" ")[1];
    const { uuid } = verifyAccessToken(token);
    const match = await findByUUID(client, uuid);
    return match.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const refresh = async (_, _args, context) => {
  try {
    if (!context.headers.cookie) {
      return null;
    }
    const cookies = cookie.parse(context.headers.cookie);
    if (cookies.adso_qid) {
      const { uuid } = verifyRefreshToken(cookies.adso_qid);
      const match = await findByUUID(client, uuid);
      const token = createAccessToken(match.data);
      return token;
    }
  } catch (err) {
    console.error(err);
  }
  return null;
};

module.exports = {
  Query: {
    me: getCurrentUser
  },
  Mutation: {
    register,
    login,
    confirmUser,
    refresh
  }
};
