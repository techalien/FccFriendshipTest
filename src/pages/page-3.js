import React from 'react'
import { Link } from 'gatsby'
import Image from '../components/image'


import ChangingQuestions from '../components/changingQuestions/ChangingQuestions.jsx'


import Layout from '../components/layout'

const ThirdPage = () => (
  <Layout>
   
    <p>FCC FRIENDSHIP TEST</p>
    
    <div style={{ maxWidth: '300px', marginBottom: '1.45rem' }}>

<ChangingQuestions />

<Image />
    </div>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default ThirdPage