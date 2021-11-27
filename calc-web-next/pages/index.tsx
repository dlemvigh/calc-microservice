import Head from 'next/head'
import Image from 'next/image'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Calculation microservice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

    </div>
  )
}

export default Home
