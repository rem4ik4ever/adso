import React from "react";
import Head from "next/head";
import styled from "styled-components";

const SyperStyledDiv = styled.div`
  background-color: black;
  color: white;
  margin: 12px auto;
  padding: 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <SyperStyledDiv>This Looks very stylish</SyperStyledDiv>
  </div>
);

export default Home;
