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
    if(props.isWaiting) {
        return (
            <span>Waiting for player response {props.customMessage}</span>
        );
    } else {
        return null;
    }
}

function PlayerResponse(props) {
    if(props.isTurn) {
        return (
            <div>
                <span>Word given to you is {props.word}</span>
                <input type="text" onChange={props.textChange} />
                <button onClick={props.responseHandler}>Submit!</button>
            </div>
        );
    } else {
        return null;
    }
}

class WordGame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isLandingPage: true, gameStarted: false, isWaiting:false};
        this.createGame = this.createGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.joinGameRefInputHandler = this.joinGameRefInputHandler.bind(this);
        this.updateGame = this.updateGame.bind(this);
        this.responseTextHandler = this.responseTextHandler.bind(this);

        this.client = new faunadb.Client({secret: FAUNA_SECRET});   
    }

    joinGameRefInputHandler(e) {
        e.preventDefault();

        this.setState({gameRef: e.target.value})
    }

    responseTextHandler(e) {
        e.preventDefault();
        this.responseWord = e.target.value;
    }

    updateGame(e) {
        console.log("Updating game");

        this.client.query(
            q.Update(
              q.Ref(q.Class("game"), this.state.gameRef),
              { data: { word: this.responseWord, turn: (this.state.turnMod + 1)%2}}))
          .then((ret) => console.log(ret))
        
        this.setState({currentTurn: false, isWaiting: true})

        this.poller = setInterval(
            () => this.checkForUpdate(),
            1000
        )
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
                    clearInterval(this.poller);
                    this.setState({word: refObject.data.word, isWaiting: false, currentTurn: true});
                } else if (refObject.data.gameWon) {
                    //Do something for win
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
            this.poller = setInterval(
                () => this.checkForUpdate(),
                1000
            );
        })
    }

    joinGame(e) {
        e.preventDefault();
        console.log("Joining game " + this.state.gameRef);

        this.client.query(q.Get(q.Ref(
            q.Class("game"), this.state.gameRef))).then((refObject) => {
                if(refObject.ref.value.id == this.state.gameRef) {
                    this.client.query(
                        q.Update(
                          q.Ref(q.Class("game"), this.state.gameRef),
                          { data: { gameStarted: true, turn: 0} }))
                      .then((ret) => console.log(ret))
                    this.setState({isLandingPage: false, isWaiting:true, turnMod:1});
                    this.poller = setInterval(
                        () => this.checkForUpdate(),
                        1000
                    );
                }
            })
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
                    customMessage = {this.waitMessage}/>
                <PlayerResponse
                    isTurn = {this.state.currentTurn} 
                    word={this.state.word}
                    textChange={this.responseTextHandler}
                    responseHandler={this.updateGame}/>
            </div>
        );
    }
}

export default WordGame;