import React, { Component } from 'react';
import faunadb, { query as q } from "faunadb";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloudUploadIcon from '@material-ui/core/Icon';

import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { FAUNA_SECRET } from '../../constants';

var client = {};

const questionList = [["What is your name?", "FriendA"],["Send the challenge to a friend(email)?", "testmail@nonexistant.com"],["Question 1: Do you like reading books?", ["yes", "no", "maybe"]], ["Question 2: What is your age?", 100], ["Question 3: Do you like dogs?", ["yes", "no"]], ["Question 4: How much do you like to study?", ["very much","a lot", "so and so", "not at all"]]];

const buttonStyle = {
    marginLeft: '100px',
};

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

//const { classes } = this.props;

function LandingPage(props) {
    if (props.render) {
        return (
            <div>
                <Grid container spacing={24}>
                    <Paper style={containerStyle}>
                        <Grid style={elementStyle} item xs>
                            <Button variant="contained" color="primary" onClick={props.createGameHandler}>Start the Quiz</Button>
                        </Grid>
                        <Divider />
                        <Grid item xs={8}>
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

function QuestionCard(props) {
    //console.log(props.questionNumber);
    console.log(props);
    let question = questionList[props.questionNumber][0];
    let answer = questionList[props.questionNumber][1];
    if ((props.isQuestion) && (!Array.isArray(answer))) {
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
                        value={props.word}
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
    } else if ((props.isQuestion) && (Array.isArray(answer))) {
          return (
            <Paper>
                <Grid container>
                    <span>{question}</span>
                </Grid>
                <Grid container>
                    <form /* className={classes.root} */ autoComplete="on">

                        <FormControl required /* className={classes.formControl} */>
                           {/*  <InputLabel htmlFor="answer-required">Age</InputLabel> */}
                           <div>
                                <Select id="possibleAnswers"
                                    value={answer[0]}
                                    onChange={props.textChange}
                                    inputProps={{
                                        id: 'answer-required',}}
                                    //className={classes.selectEmpty}
                                >
                                    {answer[0] && <MenuItem value={answer[0]}>`{answer[0]}`</MenuItem>}
                                    {answer[1] && <MenuItem value={answer[1]}>`{answer[1]}`</MenuItem>}
                                    {answer[2] && <MenuItem value={answer[2]}>`{answer[2]}`</MenuItem>}
                                    {answer[3] && <MenuItem value={answer[3]}>`{answer[3]}`</MenuItem>}
                                    {answer[4] && <MenuItem value={answer[4]}>`{answer[4]}`</MenuItem>}
                                </Select>
                                    <Button style={buttonStyle} variant="outlined" color="secondary" onClick={props.submitAnswerHandler}>Submit</Button>
                              </div>
                            <FormHelperText>Pick answer from dropdown list</FormHelperText>
                        </FormControl>
                    </form>                        
                </Grid>
            </Paper>
        );
    } else {
        return null;
    }
}

function GameOver(props) {
    console.log("props in game over",props);
    if (props.gameOver) {
        if (props.gameWon) {
            let friendA=Object.values(props.answersPl1);
            let friendB=Object.values(props.answersPl2);
            let totalAnswers=friendA.length;
            let correctAnswers=0;
            let score="";

            function compare(a,b){
                for (let i=2;i<totalAnswers;i++){
                    if (a[i]===b[i]){
                        correctAnswers=correctAnswers+1;
                    }
                }
            }
            compare(friendA,friendB);
            return (
               
                <p>Your knew {correctAnswers} out of {totalAnswers - 2}</p>
            );
        } else {
            return (
               
                <p>Email this id to your friend:  {props.id} </p>
            );
        }
    } else {
        return null;
    }
}

/* function PlayerWait(props) {
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
} */


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


class ChangingQuestions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {loading:false,isLandingPage: true, questionsList: questionList, gameStarted: false, questionNumber: 0, responseWord: "" ,gameOver:false,gameWon:false,gameRef:0,answersPl1:{},answersPl2:{}};
        this.createGame = this.createGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.joinGameRefInputHandler = this.joinGameRefInputHandler.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
        this.responseTextHandler = this.responseTextHandler.bind(this);
        this.endGame = this.endGame.bind(this);
        this.addFriend = this.addFriend.bind(this);
        //this.checkForUpdate = this.checkForUpdate.bind(this);
        //this.updateGame = this.updateGame.bind(this);
        //this.setPoller = this.setPoller.bind(this);
        //this.countDownState = this.countDownState.bind(this);
        //this.startCountDown = this.startCountDown.bind(this);

        this.client = new faunadb.Client({ secret: FAUNA_SECRET });
        this.answersA = {};
        this.answersList = {};
    }


    joinGameRefInputHandler(e) {
        e.preventDefault();

        this.setState({ gameRef: e.target.value })
    }

    responseTextHandler(e) {
        e.preventDefault();
        this.setState({ responseWord: e.target.value });

    }

    endGame() {
        console.log("Ending Game");
/* 
        this.client.query(
            q.Update(
                q.Ref(q.Class("game"), this.state.gameRef),
                { data: { gameWon: true } }))
            .then((ret) => console.log(ret)) */

       this.addFriend();
        this.setState({ currentTurn: false, gameOver: true,isQuestion:false });
    }

    submitAnswer(e) {
        console.log("Submiting answer and changing question");
        console.log("props", this.props, "state", this.state);
        console.log("answersList in submitAnswer", this.answersList);
        this["answersList"][`answer${this.state.questionNumber}`] = this.state.responseWord;
        console.log("answersList in submitAnswer with new answer", this.answersList);
        this.setState({ responseWord: "" });
        console.log(this.state);
        if (this.state.questionNumber == this.state.questionsList.length-1){
            this.endGame();
        }else {
        this.setState({ questionNumber: this.state.questionNumber + 1 });
        }
    }

    createGame(e) {
        e.preventDefault();
        console.log("Creating game");
        this.setState({ gameRef: 0, isLandingPage: false, isQuestion: true });
    }

    joinGame(e) {
        e.preventDefault();
        console.log("Joining game " + this.state.gameRef);
        
            this.setState({ loading: true });
            this.client.query(q.Get(q.Ref(
                q.Class("friends"), this.state.gameRef))).then((refObject) => {
                    console.log(refObject);
                    if (refObject.ref.value.id === this.state.gameRef) {
                        console.log("good game ID", this.state.gameRef);
                        let id = this.state.gameRef.toString();
                        console.log("ID", id);
                        this.answersA = refObject.data;
                        /* answersA=client.query(q.Get(q.Ref(q.Class("friends"), "214905968405774853"))); */
                        console.log("first player's answer the second one plays",this.answersA);
                        this.setState({  loading:false,answersPl2:this.answerA,gameWon: true, gameStarted: false, isLandingPage: true,isQuestion: false });
                        this.createGame(e);
                    }
                })
        .then((ret) => {
            console.log(ret);
            console.log(this.answersA);
           
        });
    }

    addFriend() {
        client = new faunadb.Client({ secret: FAUNA_SECRET });
        //e.preventDefault();
        console.log('new filled quiz');
        if (this.state.gameRef==0){
            this.setState({answersPl1:this.answersList});
        }
        client.query(
            q.Create(
                q.Class("friends"),
                {
                    data: this.answersList
                }))
            .then((ret) => {console.log(ret);
            this.setState({ gameRef: ret.ref.value.id});
            console.log("game ref at end game",this.state.gameRef);
            })
    }

    /* addFriend(e) {
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
    } */

    componentDidMount() {
        // this.startCountDown();
    }

    
   /*  setPoller() {
        this.poller = setInterval(
            () => this.checkForUpdate(),
            1000
        )
    } */

   /*  startCountDown() {
        this.countDownTimer = setInterval(
            () => this.countDownState(),
            1000
        )
    } */

    /* countDownState() {
        console.log("Counting down");
        this.setState((state, props) => ({
            countDown: state.countDown - 1,
        }))

        if (this.state.countDown === 0 && this.state.currentTurn && this.state.gameStarted) {
            this.endGame()
        }
    } */



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

   /*  checkForUpdate() {
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
    } */

   

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

    

    render() {
        return (
            <div>
                <LandingPage
                    render={this.state.isLandingPage}
                    createGameHandler={this.createGame}
                    joinGameHandler={this.joinGame}
                    joinText={this.joinGameRefInputHandler} />
                {/* <PlayerWait
                    isWaiting={this.state.isWaiting}
                    customMessage={this.waitMessage}
                    gameStart={this.state.gameStarted}
                    countDown={this.state.countDown} /> */}
                <QuestionCard
                    isQuestion={this.state.isQuestion}
                    questionNumber={this.state.questionNumber}
                    isTurn={this.state.currentTurn}//
                    question={this.state.question}
                    word={this.state.responseWord}//
                    textChange={this.responseTextHandler}
                    submitAnswerHandler={this.submitAnswer}
                    /* //responseHandler={this.updateGame}// */
                    /* countDown={this.state.countDown} */ />
                    <div>
                 {this.state.loading ? <div>getting data</div>  :  <GameOver gameOver={this.state.gameOver} gameWon={this.state.gameWon} id={this.state.gameRef} answersPl1={this.state.answersPl1} answersPl2={this.state.answersPl2}/>}
                 </div>
            </div>
        );//the gameover components sohud receive props from the state.
    }
}

export default ChangingQuestions;