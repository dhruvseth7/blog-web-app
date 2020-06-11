const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const multer = require('multer');
const utilities = require(__dirname + "/utilities.js");
const BlogPost = require(__dirname + "/models/blog.js");


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://dhruvseth7:test123@cluster0-oxy6c.mongodb.net/blogAppDB", {useNewUrlParser: true, useUnifiedTopology: true});

const homeStartingContent = "Welcome to the home page. View your recent activity below.";
const aboutContent = "This is a Node and Express application to help you get started with building a blog of your own";
const contactContent = "I can be reached at dhruvseth7@berkeley.edu if you have any questions";

let storage = multer.memoryStorage();
let upload = multer({storage: storage});

app.get("/", (req, res) => {
    BlogPost.find((err, posts) => {
      if (posts) {
        res.render("home", {home: homeStartingContent, blogPosts: posts});
      }
    })
})


app.get("/about", (req, res) => {
    res.render("about", {about: aboutContent});
})

app.get("/contact", (req, res) => {
    res.render("contact", {contact: contactContent});
})

app.get("/compose", (req, res) => {
    res.render("compose");
})

app.post("/compose", upload.single("uploadedImage"), (req, res) => {
    const title = req.body.title;
    const content = req.body.post;
    let image = req.body.image;

    if (!image || image === "") {
      image = "gridimage-" + utilities.getRandomInt(6).toString() + ".jpeg";
    }


    var newPost;
    if (!req.file) {
         newPost = new BlogPost({
            title: title,
            content: content,
            postedDate: utilities.getDate(),
            image: image
        })
    } else {
        newPost = new BlogPost({
           title: title,
           content: content,
           postedDate: utilities.getDate(),
           imageFile: {
             data: req.file.buffer,
             contentType: 'image/png'
           }
       })
    }

    newPost.save().then(() => res.redirect("/"));
})

app.get("/posts/:postId", (req, res) => {
    let postId = req.params.postId;
    BlogPost.findOne({_id: postId}, (err, doc) => {
        if (doc) {
            res.render("post", {post: doc});
        }
    })
})

app.get("/delete/:deleteId", (req, res) => {
    let deleteId = req.params.deleteId;
    BlogPost.deleteOne({_id: deleteId}, (err) => {
        if (!err) {
          res.redirect("/");
        }
    })
})

app.get("/update/:updateId", (req, res) => {
    let updateId = req.params.updateId;
    BlogPost.findOne({_id: updateId}, (err, doc) => {
        res.render("update", {title: doc.title, content: doc.content, id: updateId});
    })
})

app.post("/update", (req, res) => {
    const updateId = req.body.id;
    const updatedTitle = req.body.title;
    const updatedContent = req.body.post;

    BlogPost.updateOne({_id: updateId}, {
        title: updatedTitle,
        content: updatedContent,
        postedDate: utilities.getDate()
    }).then(() => res.redirect("/"));
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
