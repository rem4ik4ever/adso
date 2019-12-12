const { sign, verify, decode } = require("jsonwebtoken");
const createAccessToken = user => {
  return sign(
    {
      uuid: user.uuid
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "2d"
    }
  );
};

const createRefreshToken = user => {
  return sign({ uuid: user.uuid }, process.env.ACCESS_TOKEN_REFRESH_SECRET, {
    expiresIn: "7d"
  });
};

const verifyAccessToken = token =>
  verify(token, process.env.ACCESS_TOKEN_SECRET);

const verifyRefreshToken = token =>
  verify(token, process.env.ACCESS_TOKEN_REFRESH_SECRET);

const getHeaderJWT = header => {
  try {
    const token = header.split(" ")[1];
    return token;
  } catch (error) {
    console.error("Invalid token");
    return null;
  }
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getHeaderJWT
};
