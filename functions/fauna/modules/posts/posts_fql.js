const faunadb = require("faunadb");
const q = faunadb.query;

const queryByDistance = (distance, latitude, longitude) =>
  q.GTE(
    distance,
    q.Multiply(
      q.Acos(
        q.Add(
          q.Multiply(
            q.Sin(q.Radians(latitude)),
            q.Sin(
              q.Radians(q.Select(["data", "latitude"], q.Get(q.Var("ref"))))
            )
          ),
          q.Multiply(
            q.Multiply(
              q.Cos(q.Radians(latitude)),
              q.Cos(
                q.Radians(q.Select(["data", "latitude"], q.Get(q.Var("ref"))))
              )
            ),
            q.Cos(
              q.Subtract(
                q.Radians(longitude),
                q.Radians(q.Select(["data", "longitude"], q.Get(q.Var("ref"))))
              )
            )
          )
        )
      ),
      R
    )
  );

const R = 6371;
/**
 * This query filters posts by lat lng and calculates distance between given point lat/lng
 * Formula: dist = arccos(sin(lat1) · sin(lat2) + cos(lat1) · cos(lat2) · cos(lon1 - lon2)) · R
 * Whare lat1 and lat2 are Radians (PI * lat/180) and R is Great-circle distance
 *
 * @param {Float} latitude
 * @param {Float} longitude
 * @param {Int} distance
 * @param {Object} opts {perPage, after}
 */
const LocationDistanceQuery = (latitude, longitude, distance, opts) =>
  q.Map(
    q.Filter(
      // Get all posts by createdAt
      q.Paginate(q.Match(q.Index("posts_by_created_at_desc")), opts),
      q.Lambda(
        ["createdAt", "ref"],
        queryByDistance(distance, latitude, longitude)
        // Find every post which location distance less or equal to given distance
      )
    ),
    q.Lambda(["createdAt", "ref"], q.Select(["data"], q.Get(q.Var("ref"))))
  );

/**
 * Compare String by regex
 * Should be passed to paginate lambda function for posts_by_created_at_desc
 *
 * @param {String} str to match description
 */
const matchByDescriptionRegex = str =>
  q.ContainsStrRegex(
    q.LowerCase(q.Select(["data", "description"], q.Get(q.Var("ref")))),
    str.trim().toLowerCase()
  );

/**
 * Complate String by regex
 * Should be passed to lambda function for posts_by_created_at_desc
 *
 * @param {String} str to match title
 */
const matchByTitleRegex = str =>
  q.ContainsStrRegex(
    q.LowerCase(q.Select(["data", "title"], q.Get(q.Var("ref")))),
    str.trim().toLowerCase()
  );

/**
 * Find intersection between post tags and query tags
 * Should be passed to lambda function for posts_by_created_at_desc
 *
 * @param {Array<String>} tags
 */
const matchByTags = tags =>
  q.Not(
    q.IsEmpty(
      q.Intersection(q.Select(["data", "tags"], q.Get(q.Var("ref"))), tags)
    )
  );

/**
 * Search by Search Term
 * includes match by title, description and tags
 *
 * @param {String} searchTerm
 * @param {Object} opts {perPage, after}
 */
const QueryBySearchTerm = (searchTerm, opts) =>
  q.Map(
    q.Filter(
      q.Paginate(q.Match(q.Index("posts_by_created_at_desc")), opts),
      q.Lambda(
        ["createdAt", "ref"],
        q.Any([
          matchByTitleRegex(searchTerm),
          matchByDescriptionRegex(searchTerm),
          matchByTags(
            searchTerm
              .split(" ")
              .map(str => str.toLowerCase().replace(/[^a-z0-9]/g, "-"))
          )
        ])
      )
    ),
    q.Lambda(["createdAt", "ref"], q.Select(["data"], q.Get(q.Var("ref"))))
  );

const queryByPrice = (fromPrice = 0, toPrice = null) => {
  const price = q.Select(["data", "price"], q.Get(q.Var("ref")));
  return q.All([
    q.LTE(fromPrice, price),
    toPrice ? q.GTE(toPrice, price) : true
  ]);
};

const matchByAuthor = authorUUID => {
  const author_uuid = q.Select(["data", "authorId"], q.Get(q.Var("ref")));
  return q.Equals(authorUUID, author_uuid);
};

const SearchByPriceRange = (fromPrice, toPrice, opts) =>
  q.Map(
    q.Filter(
      q.Paginate(q.Match(q.Index("posts_by_created_at_desc")), opts),
      q.Lambda(["createdAt", "ref"], queryByPrice(fromPrice, toPrice))
    ),
    q.Lambda(["createdAt", "ref"], q.Select(["data"], q.Get(q.Var("ref"))))
  );

const FlexSearchQuery = (
  searchTerm,
  location = null,
  priceRange = null,
  opts = { perPage: 20 }
) => {
  let searchPrefs = [
    q.Any([
      matchByTitleRegex(searchTerm),
      matchByDescriptionRegex(searchTerm),
      matchByTags(
        searchTerm
          .split(" ")
          .map(str => str.toLowerCase().replace(/[^a-z0-9]/g, "-"))
      )
    ])
  ];
  if (location) {
    searchPrefs.push(
      queryByDistance(location.distance, location.latitude, location.longitude)
    );
  }
  if (priceRange) {
    searchPrefs.push(queryByPrice(priceRange.from, priceRange.to));
  }
  return q.Map(
    q.Filter(
      q.Paginate(q.Match(q.Index("posts_by_created_at_desc")), opts),
      q.Lambda(["createdAt", "ref"], q.All(searchPrefs))
    ),
    q.Lambda(["createdAt", "ref"], q.Select(["data"], q.Get(q.Var("ref"))))
  );
};

const SearchByAuthor = (authorId, searchTerm, opts = { perPage: 20 }) => {
  let searchPrefs = [
    q.All([
      q.Any([
        matchByTitleRegex(searchTerm),
        matchByDescriptionRegex(searchTerm)
      ]),
      matchByAuthor(authorId)
    ])
  ];
  return q.Map(
    q.Filter(
      q.Paginate(q.Match(q.Index("posts_by_created_at_desc")), opts),
      q.Lambda(["createdAt", "ref"], q.All(searchPrefs))
    ),
    q.Lambda(["createdAt", "ref"], q.Select(["data"], q.Get(q.Var("ref"))))
  );
};

module.exports = {
  LocationDistanceQuery,
  QueryBySearchTerm,
  SearchByPriceRange,
  FlexSearchQuery,
  SearchByAuthor
};
