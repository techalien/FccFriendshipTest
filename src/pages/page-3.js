import React from 'react'
import { Link } from 'gatsby'
import Image from '../components/image'


import ChangingQuestions from '../components/changingQuestions/ChangingQuestions.jsx'


import Layout from '../components/layout'

const ThirdPage = () => (
  <Layout>
    <h1>Hi </h1>
    <p>FCC FRIENDSHIP TEST</p>
    <p>JAMstack Hackathon's friendliest project!</p>
    <div style={{ maxWidth: '300px', marginBottom: '1.45rem' }}>
<p>test for fauna connection</p>
<ChangingQuestions />

<Image />
    </div>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default ThirdPage