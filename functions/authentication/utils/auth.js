const { sign, verify } = require("jsonwebtoken");
const createAccessToken = user => {
  return sign(
    {
      uuid: user.uuid
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m"
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

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
