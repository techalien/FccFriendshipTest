import React, { Component } from 'react';
import faunadb, { query as q } from "faunadb";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloudUploadIcon from '@material-ui/core/Icon';

import { FAUNA_SECRET } from '../../constants';

var client = {};

const questionList = [["question2-do you like books", ["yes", "no", "maybe"]], ["question1-your age?", 100], ["question3-do you like dogs", ["yes", "no"]], ["question4 - how much do you like to study", ["a lot", "so and so", "not at all"]], ["your name is", "FriendA"], ["Send the challenge to (email)?", "testmail@nonexistant.com"]];
/* this.questionList = [["question1-your age?",100],["question2-do you like books",["yes","no"]],["question3-do you like dogs",["yes","no"]],["question4 - how much do you like to study",["a lot","so and so","not at all"]],["your name is","FriendA"],["Send the challenge to (email)?","testmail@yahoo.com"]]; */

const buttonStyle = {
    verticalAlign: 'middle',
    alignItems: 'center'
};

function LandingPage(props) {
    if (props.render) {
        return (
            <div>
                <Paper>
                    <Grid container spacing={24}>
                        <Grid item xs>
                            <Button variant="contained" color="primary" onClick={props.createGameHandler}>Start the Quiz</Button>
                        </Grid>

                        <Grid item xs={8}>
                            <TextField
                                label="Game ID"
                                helperText="Enter ID here"
                                margin="normal"
                                variant="outlined"
                                onChange={props.joinText}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <Button variant="outlined" color="secondary" onClick={props.joinGameHandler}>Go</Button>
                                    </InputAdornment>
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    } else {
        return null;
    }
}

function PlayerWait(props) {
    let countDownTimer = null;

    if (props.gameStart) {
        countDownTimer = <LinearProgress variant="determinate" value={((props.countDown) / 60) * 100} />
    }

    if (props.isWaiting) {
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

function QuestionCard(props) {
    //console.log(props.questionNumber);
    console.log(questionList);
    let question=questionList[props.questionNumber][0];
    if (props.isQuestion) {
        return (
            <Paper>
                <Grid container>
                    <span>{question}</span>
                </Grid>
                <Grid container>
                    <TextField
                        label="Word"
                        helperText="Enter your response here"
                        margin="normal"
                        variant="outlined"
                        onChange={props.textChange}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <Button variant="outlined" color="secondary" onClick={props.submitAnswerHandler}>
                                    Submit
                        </Button>
                            </InputAdornment>
                        }}
                    />
                </Grid>
                
            </Paper>
        );
    } else {
        return null;
    }
}


/* 
function PlayerResponse(props) {
    if (props.isTurn) {
        return (
            <Paper>
                <Grid container>
                    <span>Word given to you is {props.word}</span>
                </Grid>
                <Grid container>
                    <TextField
                        label="Word"
                        helperText="Enter your response here"
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
                    />
                </Grid>
                <span>You have {props.countDown} seconds remaining.</span>
                <LinearProgress variant="determinate" value={((props.countDown) / 60) * 100} />
            </Paper>
        );
    } else {
        return null;
    }
}
 */
function GameOver(props) {
    if (props.gameOver) {
        if (props.gameWon) {
            return (
                <span>You won!!! :)</span>
            );
        } else {
            return (
                <span>You lost. :(</span>
            );
        }
    } else {
        return null;
    }
}

class ChangingQuestions extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isLandingPage: true, questionsList: questionList, gameStarted: false, isWaiting: false, countDown: 60,questionNumber:0 };
        this.createGame = this.createGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.joinGameRefInputHandler = this.joinGameRefInputHandler.bind(this);
        //this.updateGame = this.updateGame.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
        this.responseTextHandler = this.responseTextHandler.bind(this);
        this.setPoller = this.setPoller.bind(this);
        this.countDownState = this.countDownState.bind(this);
        this.endGame = this.endGame.bind(this);
        this.startCountDown = this.startCountDown.bind(this);
        this.addFriend = this.addFriend.bind(this);
        this.checkForUpdate = this.checkForUpdate.bind(this);
        

        this.client = new faunadb.Client({ secret: FAUNA_SECRET });
        this.answersA={};
        this.answersList={};
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

        if (this.state.countDown === 0 && this.state.currentTurn && this.state.gameStarted) {
            this.endGame()
        }
    }

    joinGameRefInputHandler(e) {
        e.preventDefault();

        this.setState({ gameRef: e.target.value })
    }

    responseTextHandler(e) {
        e.preventDefault();
        this.responseWord = e.target.value;
    
    }

    endGame() {
        console.log("Ending Game");

        this.client.query(
            q.Update(
                q.Ref(q.Class("game"), this.state.gameRef),
                { data: { gameWon: true } }))
            .then((ret) => console.log(ret))

        clearInterval(this.countDownTimer)
        this.setState({ gameWon: false, currentTurn: false, gameOver: true });
    }

    submitAnswer(e) {
        console.log("Submiting answer and changing question");
        
        
        this.client.query(
            q.Update(
                q.Ref(q.Class("game"), this.state.gameRef),
                { data: { word: this.responseWord, turn: (this.state.turnMod + 1) % 2 } }))
            .then((ret) => console.log(ret))

        this.setState({ countDown: 60 });
        this.setState({ currentTurn: false, isWaiting: true })
        this.setPoller()
    }

   /*   submitAnswer(e) {
        console.log("Submiting answer and changing question");
        
        this.client.query(
            q.Update(
                q.Ref(q.Class("game"), this.state.gameRef),
                { data: { word: this.responseWord, turn: (this.state.turnMod + 1) % 2 } }))
            .then((ret) => console.log(ret))

        this.setState({ countDown: 60 });
        this.setState({ currentTurn: false, isWaiting: true })
        this.setPoller()
    } */

    checkForUpdate() {
        let turn = this.state.turnMod;

        console.log("Checking for update");
        this.client.query(q.Get(q.Ref(
            q.Class("game"), this.state.gameRef))).then((refObject) => {
                let updatedTurn = refObject.data.turn;
                console.log(updatedTurn);
                if (updatedTurn == turn) {
                    this.waitMessage = "";
                    this.setState({ countDown: 60 })
                    clearInterval(this.poller);
                    this.setState({ gameStarted: true, word: refObject.data.word, isWaiting: false, currentTurn: true });
                } else if (refObject.data.gameWon) {
                    clearInterval(this.poller);
                    clearInterval(this.countDownTimer)
                    this.setState({ gameWon: true, gameOver: true, isWaiting: false })
                }
            })
    }

    createGame(e) {
        e.preventDefault();
        console.log("Creating game");

        //let refObject;

        this.setState({ gameRef: 0, isLandingPage: false, turnMod: 0, isWaiting: false, isQuestion:true });

    }

   /*  createGame(e) {
        e.preventDefault();
        console.log("Creating game");

        //let refObject;
        this.client.query(
            q.Create(
                q.Class("game"),
                {
                    data: {
                        "turn": 1,
                        "word": "Start",
                        "responseRef": "",
                        "gameStarted": false
                    }
                }
            )
        ).then((refObject) => {
            console.log("Game ID Created: " + refObject.ref.value.id);

            this.waitMessage = "Ask friend to join at " + refObject.ref.value.id;
            this.setState({ gameRef: refObject.ref.value.id, isLandingPage: false, turnMod: 0, isWaiting: true });
            //this.setPoller();
        })
    } */



    joinGame(e) {
        e.preventDefault();
        console.log("Joining game " + this.state.gameRef);
        
        var p1 = new Promise((resolve, reject) => {
            this.client.query(q.Get(q.Ref(
                q.Class("friends"), this.state.gameRef))).then((refObject) => {
                    console.log(refObject);
                    if (refObject.ref.value.id === this.state.gameRef) {
                        console.log("good game ID", this.state.gameRef);
                        let id=this.state.gameRef.toString();
                        console.log("ID",id);
                        this.answersA=refObject.data;
                        /* answersA=client.query(q.Get(q.Ref(q.Class("friends"), "214905968405774853"))); */
                        console.log(this.answersA);
                    }
                })
        });
        
        p1.then((ret) => {
            console.log(ret);
            console.log(this.answersA);
            this.setState({ gameStarted: true, countDown: 60, isLandingPage: false, isWaiting: true, turnMod: 1 });
            this.setPoller();});
        }
    


/* joinGame(e) {
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
*/

addFriend(e) {
    client = new faunadb.Client({ secret: FAUNA_SECRET });
    e.preventDefault();
    console.log('new friend');
    let name = "ion" + Math.floor(Math.random() * 1000);
    let second_name = "secondName" + Math.floor(Math.random() * 1000);
    let age = Math.floor(Math.random() * 100);
    client.query(
      q.Create(
        q.Class("friends"),
        {
          data: {
            "name": `${name}`,
            "question1": `how old is ${name} ?`,
            "answer1": `${age}`,
            "question2": `where ${name} lives?`,
            "answer2": `${name}inIsrael`,
            "email": `${name}@gmail.com`,
            "second_name": `${second_name}`,
            "responseRef": ``
          }
        }))
      .then((ret) => console.log(ret))
  }



componentDidMount() {
    // this.startCountDown();
}

render() {
    return (
        <div>
            <LandingPage
                render={this.state.isLandingPage}
                createGameHandler={this.createGame}
                joinGameHandler={this.joinGame}
                joinText={this.joinGameRefInputHandler} />
            <PlayerWait
                isWaiting={this.state.isWaiting}
                customMessage={this.waitMessage}
                gameStart={this.state.gameStarted}
                countDown={this.state.countDown} />
            <QuestionCard
                isQuestion={this.state.isQuestion}
                questionNumber={this.state.questionNumber}
                isTurn={this.state.currentTurn}//
                question={this.state.question}
                word={this.state.word}//
                textChange={this.responseTextHandler}
                submitAnswerHandler={this.submitAnswer}
                //responseHandler={this.updateGame}//
                countDown={this.state.countDown} />
            <GameOver gameOver={this.state.gameOver} gameWon={this.state.gameWon} />
        </div>
    );
}
}

export default ChangingQuestions;