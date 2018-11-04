import React from 'react'
import { Link } from 'gatsby'
import Image from '../components/image'
import Layout from '../components/layout'
import Button from '@material-ui/core/Button';


const LandingPage = () => (
    <Layout>    
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous"></link>
        <h1>Select your Game</h1>
        <div style={{ maxWidth: '300px', marginBottom: '1.45rem' }}>
            <Image />
        </div>
        <div class="game-selection">
            <Button variant="contained"><Link class="link" to="/page-2/">WORD GAME</Link><i class="fas fa-file-word"></i></Button>
            <div class="divider"/>
            <Button variant="contained"><Link class="link" to="/page-3/">FRIENDSHIP TEST</Link><i class="fas fa-user-friends"></i></Button>
        </div> 
    </Layout>
)

export default LandingPage

