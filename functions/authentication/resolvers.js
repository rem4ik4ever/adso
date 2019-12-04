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

const {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken
} = require("./utils/auth");
const { AuthenticationError } = require("apollo-server-lambda");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
});

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
    console.error(err);
    return false;
  }
  return true;
};

const login = async (_, { email, password }, _context) => {
  let match = null;
  try {
    match = await findByEmail(client, email);
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

module.exports = {
  Query: {
    me: getCurrentUser
  },
  Mutation: {
    register: async (root, args, context) => register(root, args, context),
    login: async (root, args, context) => login(root, args, context),
    confirmUser: async (root, args, context) => confirmUser(root, args, context)
  }
};
