import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import Image from '../components/image'

import faunadb, { query as q } from "faunadb"
import FaunaLink from '../components/faunalink'


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
  </Layout>
)

export default IndexPage
