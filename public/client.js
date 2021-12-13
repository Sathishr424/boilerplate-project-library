$( document ).ready(function() {
  let  items = [];
  let  itemsRaw = [];
  
  $.getJSON('/api/books', function(data) {
    //let  items = [];
    itemsRaw = data;
    items.push("<ul id='booksContainer'>");
    $.each(data, function(i, val) {
      items.push('<li class="bookItem" id="' + i + '"><span>' + val.title + ' - ' + val.commentcount + ' comments<span></li>');
    });items.push("</ul>")
    // if (items.length >= 15) {
    //   items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    // }
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');
  });
  
  let  comments = [];
  $('#display').on('click','li.bookItem',function() {
    $("#detailTitle").html('<h4 style="font-weight: bold;">Comments for "'+itemsRaw[this.id].title+'"</h4><p>_id: '+itemsRaw[this.id]._id+'</p>');
    $.getJSON('/api/books/'+itemsRaw[this.id]._id, function(data) {
      comments = [];
      comments.push("<ul id='commentsContainer'>");
      $.each(data.comments, function(i, val) {
        comments.push('<li>' +val+ '</li>');
      });comments.push("</ul>");
      comments.push('<br><form id="newCommentForm" class="mborder"><label for="commentToAdd">Add new comment</label><input type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"><div style="text-align:center  "><input type="button" style="text-center:right;padding: 2px 10px; margin:5px 0px 0px 0px;display:inline" class="myBtn addComment" id="'+ data._id+'" value="Add Comment"></div></form>');
      // comments.push('<br><button class="myBtn" id="'+ data._id+'">Add Comment</button>');
      comments.push('<div style="text-align:right; margin-top:5px" ><button class="myBtnDel deleteBook" id="'+ data._id+'">Delete this Book</button></div>');
      $('#detailComments').html(comments.join(''));
    });
  });
  
  $('#bookDetail').on('click','button.deleteBook',function() {
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'delete',
      success: function(data) {
        //update list
        refreshData();
        //$('#detailComments').html('<p style="color: red;">'+data+'<p><p>Refresh the page</p>');
      }
    });
  });  
  
  $('#bookDetail').on('click','button.addComment',function(event) {
    let  newComment = $('#commentToAdd').val();
    event.preventDefault();
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        $.getJSON('/api/books/'+data._id, function(d) {
          comments = [];
          comments.push("<ul id='commentsContainer'>");
          $.each(d.comments, function(i, val) {
            comments.push('<li>' +val+ '</li>');
          });comments.push("</ul>");
          comments.push('<br><form id="newCommentForm" class="mborder"><label for="commentToAdd">Add new comment</label><input type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"><div style="text-align:center  "><input type="button" style="text-center:right;padding: 2px 10px; margin:5px 0px 0px 0px;display:inline" class="myBtn addComment" id="'+ data._id+'" value="Add Comment"></div></form>');
          // comments.push('<br><button class="myBtn" id="'+ data._id+'">Add Comment</button>');
          comments.push('<div style="text-align:right; margin-top:5px" ><button class="myBtnDel deleteBook" id="'+ data._id+'">Delete this Book</button></div>');
          $('#detailComments').html(comments.join(''));
          }); //adds new comment to top of list
        // $('#detailComments').html(comments.join(''));
      }
    });
  });

  function refreshData(){
    items = [];
    itemsRaw = [];
    $.getJSON('/api/books', function(data) {
      //let  items = [];
      itemsRaw = data;
      items.push("<ul id='booksContainer'>");
      $.each(data, function(i, val) {
        items.push('<li class="bookItem" id="' + i + '"><span>' + val.title + ' - ' + val.commentcount + ' comments<span></li>');
      });items.push("</ul>")
      // if (items.length >= 15) {
      //   items.push('<p>...and '+ (data.length - 15)+' more!</p>');
      // }
      $('#display').html("<h4 style='font-weight: bold; color:steelblue'>Books</h4>");
      $('<ul/>', {
        'class': 'listWrapper',
        html: items.join('')
        }).appendTo('#display');
    });
    $("#detailTitle").html("Select a book to see it's details and comments");
    $('#detailComments').html("");
  }
  
  $('#newBook').click(function(event) {
    event.preventDefault();
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        refreshData();
      }
    });
  });
  
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        
      }
    });
    refreshData();
  });

  //

  function addBookToDB(book){
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: {title: book.Book},
      success: function(data) {
        if (data.thereInDB) return;
        var keys = Object.keys(book);
        for (var i=1; i<keys.length; i++){
          $.ajax({
            url: '/api/books/'+data._id,
            type: 'post',
            dataType: 'json',
            data: {comment: keys[i] + ": " + book[keys[i]]},
            success: function(data) {
              console.log("Book Added");
            }
          })
        }$.ajax({
          url: '/api/books/'+data._id,
          type: 'post',
          dataType: 'json',
          data: {comment: "Chapter 1 finished."},
          success: function(data) {
            console.log("Book Added");
          }
        })
      }
    });
  }

  var books = [
    {
      Book: "To Kill a Mockingbird",
      Author: "Harper Lee",
      Rating: "4.3/5 Goodreads. 84% liked this book Google users",
      Summary: "To Kill a Mockingbird is a novel by the American author Harper Lee. It was published in 1960 and was instantly successful. In the United States, it is widely read in high schools and middle schools. To Kill a Mockingbird has become a classic of modern American literature, winning the Pulitzer Prize. Wikipedia",
      Published: "11 July 1960",
      Page_Count: 281,
      Characters: "Atticus Finch, Jean Louise 'Scout' Finch, Boo Radley, MORE..",
      Genres: "Novel, Bildungsroman, Southern Gothic, Thriller, Domestic Fiction, Legal Story",
      Awards: "Quill Award for Audio book, Pulitzer Prize for Fiction",
    },
    {
      Book: "The Catcher in the Rye",
      Author: "J. D. Salinger",
      Summary: "The Catcher in the Rye is a novel by J. D. Salinger, partially published in serial form in 1945–1946 and as a novel in 1951. It was originally intended for adults but is often read by adolescents for its themes of angst, alienation, and as a critique on superficiality in society. It has been translated widely. Wikipedia",
      Published: "16 July 1951",
      Adaptations: "Die neuen Leiden des jungen W",
      Page_Count: 277,
      Original_language: "English",
      Characters: "Holden Caulfield, Mr. Antolini, Phoebe Caulfield, MORE",
      Genres: "Novel, Bildungsroman, Young adult fiction, Coming-of-age story, First-person narrative, Literary realism"
    }
  ];

  for (var b in books) addBookToDB(books[b]);

  
  //
  
});