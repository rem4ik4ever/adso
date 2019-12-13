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

const register = async (_, { data }, _context) => {
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
        name: `${data.firstName.trim()} ${data.lastName.trim()}`,
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
    match = await client.query(
      q.Get(q.Match(q.Index("user_by_email"), email.trim().toLowerCase()))
    );
  } catch (err) {
    console.error(err);
    throw new AuthenticationError("WrongEmailOrPassword");
  }
  const user = match.data;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AuthenticationError("WrongEmailOrPassword");
  }

  if (!user.confirmed) {
    throw new AuthenticationError("EmalNotConfirmed");
  }
  return {
    accessToken: createAccessToken(user),
    refreshToken: createRefreshToken(user)
  };
};

const confirmUser = async (_, { token }, _context) => {
  const match = await findByConfirmationToken(client, token);
  if (!match) {
    console.error(`User with confirmationToken: ${token} not found`);
    return false;
  }
  const validUntil = moment(match.data.confirmationValidUntil);

  if (moment().isAfter(validUntil)) {
    throw new AuthenticationError("ConfirmationTokenExpired");
  }

  try {
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

const resendConfirmation = async (_, { token }, _context) => {
  const match = await findByConfirmationToken(client, token);
  if (!match.data) {
    console.error(`User with confirmationToken: ${token} not found`);
    return false;
  }
  const validUntil = moment(match.data.confirmationValidUntil);
  console.log(match);
  if (moment().isAfter(validUntil) && !match.data.confirmed) {
    const confirmationToken = uuidv4();
    try {
      await client.query(
        q.Update(q.Ref(match.ref), {
          data: {
            confirmationToken,
            confirmationValidUntil: moment()
              .add(1, "day")
              .format()
          }
        })
      );
      await sendEmail(
        match.data.email,
        `http://localhost:8888/confirm?token=${confirmationToken}`
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  return false;
};

module.exports = {
  Query: {
    me: getCurrentUser
  },
  Mutation: {
    register,
    login,
    confirmUser,
    refresh,
    resendConfirmation
  }
};
