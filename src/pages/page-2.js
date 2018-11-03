import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import WordGame from '../components/faunalink/WordGame.jsx';

const SecondPage = () => (
  <Layout>
    <h1>Welcome to FCC Word Game</h1>
    <WordGame/>
  </Layout>
)

export default SecondPage
