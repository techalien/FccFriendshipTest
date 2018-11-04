import React, { Component } from 'react';
import faunadb, { query as q } from "faunadb";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';

const FAUNA_SECRET = "fnAC-5___YACBQKbu91CfAcKoeYCYxO6_WX1mS29";

const containerStyle = {
    padding: '10px',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
};

const elementStyle = {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: '16px'
};

function LandingPage(props) {
     if(props.render) {
        return (
            <div>
                <Grid container spacing={24}>
                    <Paper style={containerStyle}>
                        <Grid style={elementStyle} item xs>
                            <Button  variant="contained" color="primary" onClick={props.createGameHandler}>Create Game</Button>
                        </Grid>
                        <Divider />
                        <Grid item xs>
                            <TextField 
                                label="Game ID"
                                helperText="Enter ID here"
                                margin="normal"
                                variant="outlined"
                                onChange={props.joinText}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                    <Button variant="outlined" color="secondary" onClick={props.joinGameHandler}>Join</Button>
                                    </InputAdornment>
                                }}
                            />
                        </Grid>
                    </Paper>
                </Grid>
                
            </div>
        );
    } else {
        return null;
    }
}

function PlayerWait(props) {
    let countDownTimer = null;

    if(props.gameStart) {
        countDownTimer = <LinearProgress variant="determinate" value={((props.countDown)/60)*100} /> 
    }

    if(props.isWaiting) {
        return (
            <Paper>
                <h5>Waiting for player response {props.customMessage}</h5>
                {countDownTimer}
            </Paper>
        );
    } else {
        return null;
    }
}

function PlayerResponse(props) {

    if(props.isTurn) {
        let responseField;
        if(props.isValid) {
            responseField = (<TextField
                label="Word"
                helperText="Enter your response here"
                value={props.textFieldValue}
                margin="normal"
                variant="outlined"
                onChange={props.textChange}
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                    <Button variant="outlined" color="secondary" onClick={props.responseHandler}>
                        Submit
                    </Button>
                    </InputAdornment>
                }}
            />)
        } else {
            let errorMessage = props.responseUsed? "This word has been used!" : "First letter is invalid!"

            responseField = (<TextField
                error
                label="Word"
                value={props.textFieldValue}
                helperText={errorMessage}
                margin="normal"
                variant="outlined"
                onChange={props.textChange}
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                    <Button variant="outlined" color="secondary" onClick={props.responseHandler}>
                        Submit
                    </Button>
                    </InputAdornment>
                }}
            />)
        }

        return (
                <Grid container>
                    <Paper style={containerStyle}>
                        <Grid item>
                            <span>Word given to you is {props.word}</span>
                        </Grid>

                        <Grid item>
                            {responseField}
                        </Grid>

                        <Grid item>
                            <span>You have {props.countDown} seconds remaining.</span>
                            <LinearProgress variant="determinate" value={((props.countDown)/60)*100} />
                        </Grid> 
                    </Paper>
                </Grid>
        );
    } 

    return null;
}

function GameOver(props) {
    if(props.gameOver) {
        if(props.gameWon) {
            return (
                <span>You won!!! :)</span>
            );
        } else {
            return (
                <span>You lost. :(</span>
            );
        }
    } 

    return null;
}

class WordGame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isLandingPage: true, gameStarted: false, isWaiting:false, countDown: 60, usedWords: []};
        this.createGame = this.createGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.joinGameRefInputHandler = this.joinGameRefInputHandler.bind(this);
        this.updateGame = this.updateGame.bind(this);
        this.responseTextHandler = this.responseTextHandler.bind(this);
        this.setPoller = this.setPoller.bind(this);
        this.countDownState = this.countDownState.bind(this);
        this.endGame = this.endGame.bind(this)
        this.startCountDown = this.startCountDown.bind(this)

        this.client = new faunadb.Client({secret: FAUNA_SECRET});   
    }

    setPoller() {
        this.poller = setInterval(
            () => this.checkForUpdate(),
            1000
        )
    }

    startCountDown() {
        this.countDownTimer = setInterval(
            () => this.countDownState(),
            1000
        )
    }

    countDownState() {
        console.log("Counting down");
        this.setState((state, props) => ({
            countDown: state.countDown - 1,
        }))
        
        if(this.state.countDown === 0 && this.state.currentTurn && this.state.gameStarted) {
            this.endGame()
        }
    }

    joinGameRefInputHandler(e) {
        e.preventDefault();

        this.setState({gameRef: e.target.value})
    }

    responseTextHandler(e) {
        e.preventDefault();
        
        this.setState({responseWord: e.target.value})

        let currentWord = this.state.word;
        let validChar = currentWord.charAt(currentWord.length - 1);
        let currentChar = e.target.value.charAt(0);

        if(validChar.toLowerCase() === currentChar.toLowerCase()) {
            this.setState({responseValid: true}) 

            let wordList = this.state.usedWords;
            if(wordList.includes(e.target.value.toLowerCase())) {
                this.setState({responseValid: false, responseUsed: true})
            } else {
                this.setState({responseValid: true, responseUsed: false})
            }
        } else {
            this.setState({responseValid: false})
        }
    }

    endGame() {
        console.log("Ending Game");

        this.client.query(
            q.Update(
              q.Ref(q.Class("game"), this.state.gameRef),
              { data: {gameWon: true}}))
          .then((ret) => console.log(ret))

          clearInterval(this.countDownTimer)
          this.setState({gameWon: false, currentTurn: false, gameOver:true});
    }

    updateGame(e) {
        console.log("Updating game");

        if(this.state.responseValid) {
            this.client.query(
                q.Update(
                q.Ref(q.Class("game"), this.state.gameRef),
                { data: { word: this.state.responseWord, turn: (this.state.turnMod + 1)%2}}))
            .then((ret) => console.log(ret))
            
            this.setState({countDown: 60});
            this.setState({currentTurn: false, isWaiting: true, responseWord: ""})
            this.setState((state, props) => {
                usedWords: state.usedWords.push(this.state.responseWord.toLowerCase())
            })
            this.setPoller()
        }
    }

    checkForUpdate() {
        let turn = this.state.turnMod;

        console.log("Checking for update");
        this.client.query(q.Get(q.Ref(
            q.Class("game"), this.state.gameRef))).then((refObject) => {
                let updatedTurn = refObject.data.turn;
                console.log(updatedTurn);
                if(updatedTurn == turn) {
                    this.waitMessage = "";
                    this.setState({countDown:60})
                    clearInterval(this.poller);
                    this.setState({gameStarted: true, word: refObject.data.word, isWaiting: false, currentTurn: true, responseValid: true});
                    this.setState((state, props) => {
                        usedWords: state.usedWords.push(refObject.data.word.toLowerCase())
                    })
                } else if (refObject.data.gameWon) {
                    clearInterval(this.poller);
                    clearInterval(this.countDownTimer)
                    this.setState({gameWon: true, gameOver: true, isWaiting: false})
                }
            });
    }

    createGame(e) {
        e.preventDefault();
        console.log("Creating game");

        //let refObject;
        this.client.query(
            q.Create(
                q.Class("game"),
                {data: {
                    "turn": 1,
                    "word": "Start",
                    "responseRef": "",
                    "gameStarted": false 
                }}
            )
        ).then((refObject) => {
            console.log("Game ID Created: " + refObject.ref.value.id);

            this.waitMessage = "Ask friend to join at " + refObject.ref.value.id;
            this.setState({gameRef: refObject.ref.value.id, isLandingPage: false, turnMod:0, isWaiting:true});
            this.setPoller();
        });
    }

    joinGame(e) {
        e.preventDefault();
        console.log("Joining game " + this.state.gameRef);

        this.client.query(q.Get(q.Ref(
            q.Class("game"), this.state.gameRef))).then((refObject) => {
                if(refObject.ref.value.id === this.state.gameRef) {
                    this.client.query(
                        q.Update(
                          q.Ref(q.Class("game"), this.state.gameRef),
                          { data: { gameStarted: true, turn: 0} }))
                      .then((ret) => console.log(ret))
                    this.setState({gameStarted: true, countDown:60, isLandingPage: false, isWaiting:true, turnMod:1});
                    this.setPoller();
                }
            })
    }
    
    componentDidMount() {
        this.startCountDown();
    }

    render() {
        return (
            <div>
                <LandingPage 
                    render={this.state.isLandingPage} 
                    createGameHandler={this.createGame} 
                    joinGameHandler={this.joinGame} 
                    joinText={this.joinGameRefInputHandler}/>
                <PlayerWait
                    isWaiting = {this.state.isWaiting}
                    customMessage = {this.waitMessage}
                    gameStart = {this.state.gameStarted}
                    countDown = {this.state.countDown}/>
                <PlayerResponse
                    isTurn = {this.state.currentTurn} 
                    word={this.state.word}
                    textChange={this.responseTextHandler}
                    responseHandler={this.updateGame}
                    countDown = {this.state.countDown}
                    isValid = {this.state.responseValid}
                    textFieldValue = {this.state.responseWord}
                    responseUsed = {this.state.responseUsed}/>
                <GameOver gameOver={this.state.gameOver} gameWon={this.state.gameWon}/>
            </div>
        );
    }
}

export default WordGame;