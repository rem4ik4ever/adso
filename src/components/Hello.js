import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const HELLO_QUERY = gql`
  {
    hello
  }
`;

export default function Hello() {
  const { loading, error, data } = useQuery(HELLO_QUERY);

  if (loading) return <p>Loading... </p>;
  if (error) return <p>Error: ({error})</p>;
  console.log(data);
  return <p>Hey there! {data.hello}</p>;
}
