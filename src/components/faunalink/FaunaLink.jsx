import React, { Component } from 'react';
import faunadb, { query as q } from "faunadb";
import {FAUNA_SECRET} from '../../constants';

var client = {};


class FaunaLink extends React.Component {
    constructor(props) {
        super(props);
        this.addFriend = this.addFriend.bind(this);
        this.insertManyPosts = this.insertManyPosts.bind(this);
        this.showPostByRef = this.showPostByRef.bind(this);
        this.showPostByTitle = this.showPostByTitle.bind(this);
        this.showAllPosts = this.showAllPosts.bind(this);
        this.deleteAllPosts = this.deleteAllPosts.bind(this);
        this.deleteOnePost = this.deleteOnePost.bind(this);

    }
    


    componentDidMount() {
        
    }


    addFriend(e) {
        client = new faunadb.Client({ secret: FAUNA_SECRET });
        e.preventDefault();
        console.log('new friend');
        let name = "ion" + Math.floor(Math.random() * 1000);
        let age = Math.floor(Math.random() * 100);
        client.query(
            q.Create(
                q.Class("friends"),
                { data: {
                    "name": `${name}`,
                    "question1": `how old is ${name} ?`,
                    "answer1": `${age}`,
                    "question2": `where ${name} lives?`,
                    "answer2": `${name}inIsrael`,
                    "email": `${name}@gmail.com`
                  } }))
            .then((ret) => console.log(ret))
    }

    insertManyPosts(e) {
        client = new faunadb.Client({ secret: FAUNA_SECRET });
        e.preventDefault();
        console.log('submit many posts func');
        let number = Math.floor(Math.random() * 1000);
        client.query(
            q.Map(
                [`instance number ${number}  random-from multiple`,
                `instance number ${number}  random-from multiple`,
                `instance number ${number}  random-from multiple`],
                q.Lambda("post_title", q.Create(
                    q.Class("friends"), { data: { title: q.Var("post_title") } }))))
            .then((ret) => console.log(ret))
    }

    showPostByRef(e) {
        client = new faunadb.Client({ secret: FAUNA_SECRET});
        e.preventDefault();
        let idRef="214844684606899717";
        console.log("show post by ref func");
        client.query(q.Get(q.Ref(q.Class("friends"), idRef))).then((ret) => document.getElementById("showByRef").innerHTML = ret.data.title);

    }

    showPostByTitle(e) {
        //client = new faunadb.Client({ secret: FAUNA_SECRET});
        e.preventDefault();
        console.log("show post by title func");
        client.query(
            q.Get(
                q.Match(q.Indexes("friends"), "first post through site")))
            .then((ret) => console.log("resolve in showPosts by title",ret));
        /* client.query(
            q.Get(
                q.Match(q.Index("all_friends"), "first post through site")))
            .then((ret) => document.getElementById("showByTitle").innerHTML = ret.data); */
    }

    showAllPosts(e) {
        client = new faunadb.Client({ secret: FAUNA_SECRET });
        e.preventDefault();
        console.log("show all posts func");
        client.query(
            q.Paginate(q.Match(q.Index("all_friends"))))
            .then((ret) => ret.data.forEach(function (index) {
                var p = document.createElement("p");
                p.innerText = JSON.stringify(index.value);
                document.getElementById("showAllPosts").appendChild(p);
            }));
    }

    

    deleteAllPosts(e) {
        client = new faunadb.Client({ secret: FAUNA_SECRET });
        e.preventDefault();
        console.log("delete all posts func");
        let all = client.query(q.Paginate(q.Match(q.Index("instance number 112  random"))));
        let c=[];
        let deletePost = function (id){
            client = new faunadb.Client({ secret: FAUNA_SECRET });
            client.query(q.Delete(q.Ref(q.Class("friends"), id)));
        };
        all.then((ret)=> c=ret.data.forEach(function(index){
            c.push(index.value.id);
           
        }) ).then(c.map((index)=>{deletePost(index)}));
        
        console.log(all);
    }
    //Paginate(Match(Index("customer_id_filter"))).size(Value(pageSize));
    //q.Paginate(q.Match(q.Index("all_posts_in_second_app")),size=8)


    deleteOnePost(e) {
        client = new faunadb.Client({ secret: FAUNA_SECRET });
        e.preventDefault();
        console.log("delete one posts func by");
        client.query(q.Delete(q.Ref(q.Class("friends"), "214841931368235525"))).then((ret) => console.log(ret))
            .catch((ret) => console.log(ret))
    }

    

    render() {
        return [
            <h1>Working with fauna database</h1>,
            <br />,
            <button onClick={this.addFriend}>create one friend</button>,
            <br />,
            <button onClick={this.insertManyPosts}>create many posts</button>,
            <br />,
            <h1>show posts</h1>,
            <button onClick={this.showPostByRef}>Show post by ref</button>,
            <p id="showByRef"></p>,
            <button onClick={this.showPostByTitle}>Show post by title</button>,
            <p id="showByTitle"></p>,
            <br />,
            <button onClick={this.deleteAllPosts}>Delete all posts</button>,
            <p id="deleteAllPosts"></p>,
            <br />,
            <button onClick={this.deleteOnePost}>Delete one post by title</button>,
            <p id="deleteOnePost"></p>,
            <br />,
            <button onClick={this.showAllPosts}>Show all posts in console </button>,
            <div id="showAllPosts"></div>

        ];
    }
}

export default FaunaLink;