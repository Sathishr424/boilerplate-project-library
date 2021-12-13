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
      comments.push('<br><form id="newCommentForm" class="mborder"><label for="commentToAdd">Add new comment</label><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"><button class="myBtn addComment" id="'+ data._id+'">Add Comment</button></form>');
      // comments.push('<br><button class="myBtn" id="'+ data._id+'">Add Comment</button>');
      comments.push('<button style="text-align:right" class="myBtnDel deleteBook" id="'+ data._id+'">Delete this Book</button>');
      $('#detailComments').html(comments.join(''));
    });
  });
  
  $('#bookDetail').on('click','button.deleteBook',function() {
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'delete',
      success: function(data) {
        //update list
        $('#detailComments').html('<p style="color: red;">'+data+'<p><p>Refresh the page</p>');
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
          comments.push('<br><form id="newCommentForm" class="mborder"><label for="commentToAdd">Add new comment</label><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"><button class="myBtn addComment" id="'+ d._id+'">Add Comment</button></form>');
          // comments.push('<br><button class="myBtn" id="'+ data._id+'">Add Comment</button>');
          comments.push('<button style="text-align:right" class="myBtnDel deleteBook" id="'+ d._id+'">Delete this Book</button>');
          $('#detailComments').html(comments.join(''));
          }); //adds new comment to top of list
        // $('#detailComments').html(comments.join(''));
      }
    });
  });
  
  $('#newBook').click(function(event) {
    event.preventDefault();
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
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
          $('#display').html("");
          $('<ul/>', {
            'class': 'listWrapper',
            html: items.join('')
            }).appendTo('#display');
        });
        $("#detailTitle").html("Select a book to see it's details and comments");
        $('#detailComments').html("");
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
    $('#info').html("All books deleted please <a href='.'>refresh</a> the page");
  }); 
  
});