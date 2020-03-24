const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');




const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use( bodyParser.json() );  
app.use(express.static("public"));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3001"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
//let pathMongo = 'mongodb+srv://admin-luca:Luca123@cluster0-alpfu.mongodb.net/todolistDB?retryWrites=true&w=majority'
let pathMongo ='mongodb://localhost:27017/wikiDB'
mongoose.connect(pathMongo,{useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false});

const ARTICLES_URI = '/articles';

const articleSchema = {
  title: String,
  content: String
}

const Article = new mongoose.model('Article',articleSchema);



app.route(ARTICLES_URI)
.get((req,res) => {
    Article.find({}, (err,foundItems) => {
        if(!err){
            res.send(foundItems)
        }else{
            res.send(err);
        }
    })   
})
.post((req,res) => {

    if (req.body.hasOwnProperty('delete') && req.body.delete) {
        const id = req.body.id; 
        Article.deleteOne({_id:id},(err) => {
            if(!err){
                res.send('article deleted!')
            }else{
                res.send(err)
            }
        })
    } else {
        const title = req.body.title; 
        const content = req.body.content;  
        
        const article = new Article({
            title: title,
            content: content
        })
        Article.insertMany([
            article
        ], (err) => {
            if(!err){
                res.send(article)
            }else{
                res.send(err)
            }
        })
    }
})
.delete((req,res) => {
    Article.deleteMany({}, (err) => {
        if(!err){
            res.send("delete all articles")
        }else{
            res.send(err)
        }
    })   
});

app.route(ARTICLES_URI+'/:id')
.get((req,res) => {
    const title = req.params.title

    Article.findOne({title:title}, (err,foundItem) => {
        if(!err){
            if (foundItem) {
                res.send(foundItem)
            } else {
                res.send('Article not found')
            }
        }else{
            res.send(err)
        }
    })
})
.put((req,res) => {
    const title = req.params.title
    const content = req.body.content
    const newTitle = req.body.title

    Article.update(
        {title:title},
        {title:newTitle, content:content},
        {overwrite:true},
        (err,result) => {
        if (!err) {
            res.send(result)
        } else {
            res.send(err)
        }
    })
})
.patch((req,res) => {
    const title = req.params.title

    Article.update(
        {title:title},
        {$set: req.body},
        (err,result) => {
        if (!err) {
            res.send(result)
        } else {
            res.send(err)
        }
    })
})
.delete((req,res) => {
    const id = req.params.id
    const title = req.body.id; 
    console.log(id);
    console.log(title);
    
    
    Article.deleteOne({_id:id},(err) => {
        if(!err){
            res.send('article deleted!')
        }else{
            res.send(err)
        }
    })
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});