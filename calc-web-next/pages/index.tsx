import { CalculationForm } from '../components/Form/CalculationForm';
import { CalculationList } from '../components/List/CalculationList';
import Head from 'next/head'
import Layout from "../components/Layout";
import type { NextPage } from 'next'
import styled from "styled-components"

const Column = styled.div`
  display: flex;
  flex-direction: column;
  > * + * {
    margin-top: 64px;
  }
`;

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Calculation microservice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <GlobalStyles /> */}
      <h1>Factorials'r'us</h1>
      <Column>
        <CalculationForm />
        <CalculationList />
      </Column>
    </Layout>
  )
}

export default Home
