import { Job, getFactorials } from '../hooks/factorial';

import { CalculationForm } from '../components/Form/CalculationForm';
import { CalculationList } from '../components/List/CalculationList';
import Head from 'next/head'
import Layout from "../components/Layout";
import { NextPage } from 'next'
import styled from "styled-components"

const Column = styled.div`
  display: flex;
  flex-direction: column;
  > * + * {
    margin-top: 64px;
  }
`;

interface HomeProps {
  factorials: Job[]
}

const Home: NextPage<HomeProps> = ({ factorials }) => {
  return (
    <Layout>
      <Head>
        <title>Calculation microservice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <GlobalStyles /> */}
      <h1>Factorials&apos;r&apos;us</h1>
      <Column>
        <CalculationForm />
        <CalculationList factorials={factorials} />
      </Column>
    </Layout>
  )
}

export async function getServerSideProps() {
  const factorials = await getFactorials();
  return {
    props: {
      factorials
    }
  }
}

export default Home
