const faunadb = require("faunadb");
const q = faunadb.query;
const { client } = require("../../db/utils");

const allCategories = async (_, _args, _context) => {
  try {
    const response = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index("all_categories"))),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    );
    console.log("response", response);
    return response.data.map(d => d.data);
  } catch (err) {
    console.error(err);
    return [];
  }
};

module.exports = {
  Query: {
    allCategories
  }
};
