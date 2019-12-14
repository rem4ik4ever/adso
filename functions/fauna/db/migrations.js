#!/usr/bin/env node

// {
//   name: "posts_by_uuid",
//   unique: true,
//   serialized: true,
//   source: "posts",
//   terms: [
//     {
//       field: ["data", "uuid"]
//     }
//   ]
// }
async function createPostCreatedByIndex() {
  const res = require("dotenv").config();
  if (res.error) {
    console.log("dotenv", res.error);
  }
  const faunadb = require("faunadb");
  const { client } = require("./utils");
  const q = faunadb.query;

  if (!process.env.FAUNADB_SERVER_SECRET) {
    console.log("No FAUNADB_SERVER_SECRET in environment, skipping DB setup");
    return;
  }
  console.log("Running FaunaDB Migrations");

  try {
    const result = await client.query(
      q.CreateIndex({
        name: "posts_by_created_at_desc",
        source: q.Collection("posts"),
        values: [
          {
            field: ["data", "createdAt"],
            reverse: true
          },
          {
            field: ["ref"]
          }
        ]
      })
    );
    console.log("Result: ", result);
  } catch (err) {
    console.error("failed createPostCreatedByIndex", err);
  }
}

createPostCreatedByIndex();
