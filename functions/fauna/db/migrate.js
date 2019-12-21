#!/usr/bin/env node

const { collections, indexes } = require("faunadb-transform");

const importCollections = () => {
  let collectionsPath = require("path").join(__dirname, "collections");

  return require("fs")
    .readdirSync(collectionsPath)
    .map(function(file) {
      console.log("File", file);
      return require("./collections/" + file);
    });
};
const importIndexes = () => {
  let indexesPath = require("path").join(__dirname, "indexes");

  let imports = [];
  require("fs")
    .readdirSync(indexesPath)
    .map(function(file) {
      console.log("File", file);
      imports = imports.concat(require("./indexes/" + file));
    });
  return imports;
};

async function runMigrations() {
  const dbCollections = importCollections();
  const dbIndexes = importIndexes();
  console.log(dbIndexes);

  const res = require("dotenv").config();
  if (res.error) {
    console.log("dotenv", res.error);
  }
  if (!process.env.FAUNADB_SERVER_SECRET) {
    console.log("No FAUNADB_SERVER_SECRET in environment, skipping DB setup");
    return;
  }
  const json = {
    collections: dbCollections,
    indexes: dbIndexes
  };

  const settings = {
    target: process.env.FAUNADB_SERVER_SECRET
  };

  const collectionsRepsonse = await collections(json.collections, settings);
  const indexResponse = await indexes(json.indexes, settings);
  console.log("Migrations completed!");
}

runMigrations();
