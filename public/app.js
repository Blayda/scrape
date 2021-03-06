var selected;

$.getJSON("/articles", data => {
  for (let i = 0; i < data.length; i++) {
    data[i].imageLink
      ? (image = `<img src='${data[i].imageLink}' class='card-img-top' alt='article-image'></img>`)
      : (image = "");
    $("#articles").append(`
      <div class='card' data-id='${data[i]._id}'>
        ${image}
        <div class='card-body'>
          <h5 class='card-title'>${data[i].title}</h5>
          <p class='card-text'>${data[i].summary}</p>
          <a href='${data[i].link}' target='_blank' class='btn btn-dark' id='fullArticleBtn'>Go to full article</a>
        </div>
      </div>`);
  }
});

const clearAllDivs = () => {
  $("#articles").empty(), $("#addANote").empty(), $("#existingNotes").empty();
};

const createNoteInput = input => {
  $("#addANote").append(`<h2 class='display-4'>${input.title}</h2>`);
  $("#addANote").append(
    `<input id='titleInput' name='title' placeholder:'enter note title'>`
  );
  $("#addANote").append(
    `<textarea id='bodyInput' name='body'></textarea placeholder:'enter note text'>`
  );
  $("#addANote").append(
    `<button class='btn btn-dark' data-id='${input._id}' id='saveNote'>Save Note</button>`
  );
};

const createNoteDiv = input => {
  console.log(input);
  $("#existingNotes").append(
    `<div class='articleNoteDiv' data-id='${input._id}'> 
      <div class='articleNoteHeader'> 
        <h2 class='articleNoteTitle'> ${input.title}</h2> 
        <button class='deleteNoteBtn' data-id='${input._id}'> <i class='fas fa-times'></i> </button>
      </div>
      <div>
        <p>${input.body}</p>
      </div>
    </div>`
  );
};

$(document).on("click", "#refresh", () =>
  $.ajax({
    method: "GET",
    url: `/scrape`
  }).then(location.reload(true))
);

$(document).on("click", "#clear", clearAllDivs);

$(document).on("click", ".deleteNoteBtn", function() {
  let selectedNote = $(this).attr("data-id");
  console.log(selectedNote);
  $.ajax({
    method: "PUT",
    url: `/notes/delete/${selectedNote}`
  }).then();
});

//Whenever someone clicks a p tag
$(document).on("click", ".card", function() {
  //Empty the notes from the notes section
  $("#addANote").empty();
  $("#existingNotes").empty();
  //Save the id from the card
  selected = $(this).attr("data-id");
  console.log(selected);

  //Now make an ajax call for the article
  $.ajax({
    method: "GET",
    url: `/articles/${selected}`
  })
    // With that done, add the note information to the page
    .then(data => {
      console.log(data);
      //If there is no note in the article
      if (data[0].note == undefined || data[0].note == null) {
        //Create a note input
        createNoteInput(data[0]);
        //Otherwise
      } else {
        //Create a div for each note and a note input
        createNoteInput(data[0]);
        createNoteDiv(data[0].note);
      }
    })
    .catch(error => console.log(error));
});

// When you click the savenote button
$(document).on("click", "#saveNote", function() {
  console.log("Save note button clicked");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + selected,
    data: {
      article_id: selected,
      // Value taken from title input
      title: $("#titleInput").val(),
      // Value taken from note textarea
      body: $("#bodyInput").val()
    }
  })
    // With that done
    .then(data => createNoteDiv(data));

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleInput").val("");
  $("#bodyInput").val("");
});
