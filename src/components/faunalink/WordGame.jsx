import React, { Component } from 'react';
import faunadb, { query as q } from "faunadb";

const FAUNA_SECRET = "fnAC-5___YACBQKbu91CfAcKoeYCYxO6_WX1mS29";

function LandingPage(props) {
    if(props.render) {
        return (
            <div>
                <button onClick={props.createGameHandler}>Create Game</button><br/>
                <input type="text" onChange={props.joinText} />
                <button onClick={props.joinGameHandler}>Join Game</button>
            </div>
        );
    } else {
        return null;
    }
}

function PlayerWait(props) {
    let countDownTimer = null;

    if(props.gameStart) {
        countDownTimer = <span>{props.countDown} seconds remaining.</span> 
    }

    if(props.isWaiting) {
        return (
            <div>
                <span>Waiting for player response {props.customMessage}</span>
                {countDownTimer}
            </div>
        );
    } else {
        return null;
    }
}

function PlayerResponse(props) {
    if(props.isTurn) {
        return (
            <div>
                <span>Word given to you is {props.word}</span><br/>
                <input type="text" onChange={props.textChange} />
                <button onClick={props.responseHandler}>Submit!</button><br/>
                <span>You have {props.countDown} seconds remaining.</span>
            </div>
        );
    } else {
        return null;
    }
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
    } else {
        return null;
    }
}

class WordGame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isLandingPage: true, gameStarted: false, isWaiting:false, countDown: 60};
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
        this.responseWord = e.target.value;
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

        this.client.query(
            q.Update(
              q.Ref(q.Class("game"), this.state.gameRef),
              { data: { word: this.responseWord, turn: (this.state.turnMod + 1)%2}}))
          .then((ret) => console.log(ret))
        
        this.setState({countDown: 60});
        this.setState({currentTurn: false, isWaiting: true})
        this.setPoller()
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
                    this.setState({gameStarted: true, word: refObject.data.word, isWaiting: false, currentTurn: true});
                } else if (refObject.data.gameWon) {
                    clearInterval(this.poller);
                    clearInterval(this.countDownTimer)
                    this.setState({gameWon: true, gameOver: true, isWaiting: false})
                }
            })
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
        })
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
                    countDown = {this.state.countDown}/>
                <GameOver gameOver={this.state.gameOver} gameWon={this.state.gameWon}/>
            </div>
        );
    }
}

export default WordGame;