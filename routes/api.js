/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true});

const bookSchema = new mongoose.Schema({
  title: String,
  comments: [String]
});

let Book = new mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      // console.log("GET");
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err,data)=>{
        if (err) {res.send({error: 'Unknow error while getting books..'})}
        else if (data) {
          let ret = data.map((book)=>{
            return {_id: book._id, title: book.title, commentcount: book.comments.length};
          });
          // console.log(ret.map(item=>item._id));
          res.send(ret);
        }else {res.send({error: 'Unknow error while getting books..'})}
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      // console.log("POST: ", title);
      //response will contain new book object including atleast _id and title
      if (!title) res.send("missing required field title");
      else{
        Book.findOne({title:title}, (e,d)=>{
          if (d) {res.send({title: d.title, _id: d._id, thereInDB:true})}
          else {
            Book.create({title: title, comments: []}, (err,data)=>{
              if (err) {console.log(err); res.send({error: 'Unknow error while creating book..'})}
              else if (data) {res.send({title: data.title, _id: data._id})}
              else {res.send(res.send({error: 'Unknow error while creating book..'}))};
            })
          }
        })
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err,del)=>{
        if (del) res.send("complete delete successful")
        else {res.send({error: "some error acquired while deleting books.."})}
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      // console.log("GET: ", bookid);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if (!bookid) res.send("missing required field bookid");
      else{
        if (!ObjectID.isValid(bookid)) res.send("no book exists")
        else Book.findOne({_id: bookid}, (err,data)=>{
          if (err) {console.log(err); res.send("no book exists")}
          else if(data) { res.send({title: data.title, _id: data._id, comments: data.comments, commentcount: data.comments.length}) }
          else {res.send("no book exists")}
        })
      }
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      // console.log("POST: ", bookid, comment);
      //json res format same as .get
      if (!comment) {res.send("missing required field comment");}
      else{
        if (!ObjectID.isValid(bookid)) res.send("no book exists")
        else Book.findOne({_id: bookid}, (err,data)=>{
          if (err) {console.log(err); res.send('no book exists')}
          else if(data){
            // console.log(data);
            data.comments.push(comment);
            data.markModified('comments');
            data.save((e,d)=>{
              if (e) {console.log(err); res.send({error: 'Unknow error while saving comment to bookid..'})}
              else if(d) {res.send({title: d.title, _id: d._id, comments: d.comments, commentcount: d.comments.length})}
              else res.send({error: 'Unknow error while saving comment to bookid..'});
            })
          }else {res.send('no book exists')}
        })
      }
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      // console.log("DELETE: ", bookid);
      //if successful response will be 'delete successful'
      if (!ObjectID.isValid(bookid)) res.send("no book exists")
      else Book.findOneAndDelete({_id: bookid}, (err,data)=>{
        if (err) {console.log(err); res.send("no book exists")}
        else if(data) {res.send("delete successful")}
        else {res.send("no book exists")}
      })
    });
  
};
