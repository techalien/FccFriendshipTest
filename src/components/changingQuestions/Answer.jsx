import React, { Component } from 'react';

class Answer extends React.Component{
    constructor(props){
        super(props);
        this.state={answerToShow:""}
        /* this.setState={
            answerToShow:""
        } */
    }
    
    componentDidMount(){
        let answerFromProp=this.props.prop;
        console.log("answerFromProp",this.props.prop);
        if (answerFromProp==100) {
            this.setState((state, props) => ({
                answerToShow:`<h1>THIS IS IT ${answerFromProp}</h1>`,
            }));
        }
    }

    render() {
        console.log("answer in answer is",this.state.answerToShow);
        return (
            <div>The answer is: {this.state.answerToShow}</div>
              )
    }
}

export default Answer;