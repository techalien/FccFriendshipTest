import React, { Component } from 'react';

class Answer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { answerToShow: "" }
        }

    componentDidMount() {
        let answerFromProp = this.props.answerArray;
        let answerNo = this.props.answerNo;
        console.log("answerFromProp", this.props.answerArray, "answerNumber(counter)", answerNo);
        if (answerFromProp == 100) {
            this.setState((state, props) => ({
                answerToShow: this.createInputFieldNumbers()

            }));
        } else {
                this.setState((state, props) => ({
                answerToShow: this.addSelectBox(),
            }));
        }
    }
    createInputFieldNumbers() {
        return (<input id="number" type="number" min="0" max="100"></input>)
    }

    addSelectBox() {
        var sel = document.getElementById('answerList');
        var opt = null;

        for (let i = 0; i < this.props.answerArray.length; i++) {

            opt = document.createElement('option');
            opt.value = this.props.answerArray[i];
            opt.innerHTML = this.props.answerArray[i];
            sel.appendChild(opt);
        }
      }

    render() {
        console.log("answer in answer is", this.state.answerToShow);
        return [
            <div id="answerOptions">{this.state.answerToShow}</div>,
            <select id="answerList" />

    ]
    }
}

export default Answer;