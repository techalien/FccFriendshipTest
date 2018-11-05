import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import WordGame from '../components/faunalink/WordGame.jsx';
import Divider from '@material-ui/core/Divider';

const divStyle = {
  paddingTop: '20px'
};

const centerStyle = {
  textAlign: 'center',
  marginLeft: 'auto',
  marginRight: 'auto'
}

const SecondPage = () => (
  <Layout>
    <div>
      <p>Word game</p>
      <WordGame/>
    </div>
    <div style={divStyle}>
      <Divider/>
      <h3>Objective</h3>  
      <ul>        
        <li>Each player takes turn creating words with the last letter of the submitted word.</li>
        <li>A player wins when the other other player runs out of time.</li>
        <li>Words cannot be repeated.</li>
      </ul>
    </div>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default SecondPage
