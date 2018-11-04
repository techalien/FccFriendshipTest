import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import Image from '../components/image'

import FaunaLink from '../components/faunalink/FaunaLink.jsx'


const IndexPage = () => (
  <Layout>
    <h1>Hi people</h1>
    <p>FCC FRIENDSHIP TEST.</p>
    <p>JAMstack Hackathon's friendliest project!</p>
    <div style={{ maxWidth: '300px', marginBottom: '1.45rem' }}>
<p>test for fauna connection</p>
<FaunaLink />

      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
    <br />
    <Link to="/landing/">Landing Page</Link>
  </Layout>
)

export default IndexPage
