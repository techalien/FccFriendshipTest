import React from 'react'
import { Link } from 'gatsby'
import Image from '../components/image'


import ChangingQuestions from '../components/changingQuestions/ChangingQuestions.jsx'


import Layout from '../components/layout'

const ThirdPage = () => (
  <Layout>
    <p>FRIENDSHIP TEST</p>
    <div style={{ maxWidth: '300px', marginBottom: '1.45rem' }}>
      <ChangingQuestions />
      <Image />
    </div>
    <div>
      <ul>
        <h3>Objective</h3>
        <li>Player 1 answers a series of questions then sumbit.</li>
        <li>Player 2 will take the same quiz but has to guess player 1 answers.</li>
        <li>After Player 2 submit, both questionaires will be compared.</li>
        <li>Player 2 is then given a score to prove their "friendship".</li>
      </ul>
    </div>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default ThirdPage