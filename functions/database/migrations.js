const faunadb = require("faunadb");
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
});

const up = async () => {
  var normalizedPath = require("path").join(__dirname, "migrations");

  const files = require("fs").readdirSync(normalizedPath);
  console.log("files", files);
};
up();

// module.exports = {
//   up
// };
