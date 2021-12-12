/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true});

const bookSchema = new mongoose.Schema({
  title: String,
  comments: [String]
});

let Book = new mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err,data)=>{
        if (err) {console.log(err); res.sed({error: 'Unknow error while getting books..'})}
        else if (data) {
          res.send(data.map((book)=>{
            return {_id: book._id, title: book.title, commentcount: comments.length};
          }))
        }else res.sed({error: 'Unknow error while getting books..'})
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) res.send("missing required field title");
      else{
        Book.create({title: title, comments: []}, (err,data)=>{
          if (err) {console.log(err); res.sed({error: 'Unknow error while creating book..'})}
          else if (data) res.send({title: data.title, _id: data._id});
          else res.send(res.sed({error: 'Unknow error while creating book..'}));
        })
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (del)=>{
        if (del) res.send("complete delete successful")
        else res.send({error: "some error acquired while deleting books.."})
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if (!bookid) res.send("missing required field bookid");
      else{
        Book.findOne({_id: bookid}, (err,data)=>{
          if (err) {console.log(err); res.sed({error: 'Unknow error while getting book from bookid..'})}
          else if(data) res.send(data)
          else res.sed({error: 'Unknow error while getting book from bookid..'})
        })
      }
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) res.send("missing required field comment");
      else{
        Book.findOne({_id: bookid}, (err,data)=>{
          if (err) {console.log(err); res.sed('no book exists')}
          else{
            data.comments.push(comment);
            data.markModified('comment');
            data.save((e,d)=>{
              if (err) {console.log(err); res.sed({error: 'Unknow error while adding comment to bookid..'})}
              else if(d) res.send(d);
              else res.sed({error: 'Unknow error while adding comment to bookid..'});
            })
          }
        })
      }
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findOneAndDelete({_id: bookid}, (err,data)=>{
        if (err) {console.log(err); res.sed({error: 'Unknow error while deleting book from bookid..'})}
        else if(data) res.send("delete successful")
        else res.sed({error: 'Unknow error while deleting book from bookid..'})
      })
    });
  
};
