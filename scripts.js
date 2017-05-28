var ideaTitleInput = $('.title-input');
var ideaBodyInput = $('.body-input');
var ideaArray = [];

//Storing and Pulling from Local storage ?? hmmm //

function ideasFromLocal() {
  var keys = Object.keys(localStorage);
  var keyLength = keys.length;
    for (var i = 0; i < keyLength; i++) {
      prependIdeaCard(JSON.parse(localStorage.getItem(keys[i])));
    }
    for (var j = 0; j < keyLength; j++) {
      ideaArray.push(JSON.parse(localStorage.getItem(keys[j])));
    } return ideaArray;
}

ideasFromLocal();

//clearing input fields //

function clearInput() {
  ideaTitleInput.val('');
  ideaBodyInput.val('');
}

//Card object instance//

function constructNewIdea(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.quality = 'Swill';
}

//HMTL injection //

function prependIdeaCard(newIdeaCard) {
  $('.bottom-section').prepend(`<section
    class="card-holder-section">
      <article class="idea-card" id=${newIdeaCard.id}>
        <div class="idea-name-section">
          <h2 contenteditable='true' class="idea-card-header">${newIdeaCard.title}</h2>
          <button class="delete-button" type="button" name="button"></button>
        </div>
        <div>
          <p contenteditable='true' class="article-text-container">${newIdeaCard.body}</p>
        </div>
        <div class="quality-control-container">
        <button class="upvote-button" type="button" name="button"></button>
        <button class="downvote-button" type="button" name="button"></button>
        <p>quality: <span class="quality">${newIdeaCard.quality}</p>
        </div>
      </article>
    </section>`);
  clearInput();
}

//Set card object to local storage //

function storeIdeaCard(newIdeaCard) {
  localStorage.setItem(newIdeaCard.id, JSON.stringify(newIdeaCard));
}

// Save button e.listener + Construct card + Inject + local store //

$('.save-button').on('click', function(event) {
    event.preventDefault();
  var ideaTitle = ideaTitleInput.val();
  var ideaBody = ideaBodyInput.val();
  var newIdeaCard = new constructNewIdea(ideaTitle, ideaBody);
  constructNewIdea();
  prependIdeaCard(newIdeaCard);
  storeIdeaCard(newIdeaCard);
});

// delete button functionality ... //

$('.bottom-section').on('click','button.delete-button', function() {
  var id = $(this).closest('.idea-card').prop('id');
  localStorage.removeItem(id);
  $(this).parents('.idea-card').remove();
});

// Making card heading editable //

$('.bottom-section').on('keyup focusout','.idea-card-header',function() {
  var id = $(this).closest('.idea-card').prop('id');
  var parseIdea = JSON.parse(localStorage.getItem(id));
  parseIdea.title = $(this).text();
  localStorage.setItem(id, JSON.stringify(parseIdea));
})

// Handles 'Enter' button for editing heading on card //

$('.bottom-section').on('keypress','.idea-card-header',function(event) {
  if (event.which == 13) {
    document.execCommand("DefaultParagraphSeparator", false, "p")
    var id = $(this).closest('.idea-card').prop('id');
    var parseIdea = JSON.parse(localStorage.getItem(id));
    parseIdea.title = $(this).text();
    localStorage.setItem(id, JSON.stringify(parseIdea));
  }
})

// Making the article element editable //

$('.bottom-section').on('keyup focusout','.article-text-container',function() {
  var id = $(this).closest('.idea-card').prop('id');
  var parseIdea = JSON.parse(localStorage.getItem(id));
  parseIdea.body = $(this).text();
  localStorage.setItem(id, JSON.stringify(parseIdea));
})

// Handles 'Enter' key for editing article on card //

$('.bottom-section').on('keydown','.article-text-container',function(event) {
  if (event.which == 13) {
    document.execCommand("DefaultParagraphSeparator", false, "p");
    var id = $(this).closest('.idea-card').prop('id');
    var parseIdea = JSON.parse(localStorage.getItem(id));
    parseIdea.title = $(this).text();
    localStorage.setItem(id, JSON.stringify(parseIdea));
  }
})

// Quality changing on upvote (isnt updating localstoarage currently)//

$('.bottom-section').on('click', 'button.upvote-button', function() {
  var id = $(this).closest('.idea-card').prop('id');
  var parseIdea = JSON.parse(localStorage.getItem(id));
    if (parseIdea.quality === 'Swill') {
      $(this).siblings('p').children().text('Plausible');
    } else if (parseIdea.quality === 'Plausible') {
      $(this).siblings('p').children().text('Genius');
    }
  parseIdea.quality = $(this).siblings('p').children().text();
  localStorage.setItem(id, JSON.stringify(parseIdea));
})

// quality changing on Downvote (inst updating localstorage )//

$('.bottom-section').on('click', 'button.downvote-button', function() {
  var id = $(this).closest('.idea-card').prop('id');
  var parseIdea = JSON.parse(localStorage.getItem(id));
    if (parseIdea.quality === 'Genius') {
      $(this).siblings('p').children().text('Plausible');
    } else if (parseIdea.quality === 'Plausible') {
      $(this).siblings('p').children().text('Swill');
    }
  parseIdea.quality = $(this).siblings('p').children().text();
  localStorage.setItem(id, JSON.stringify(parseIdea));
})

// Search functionality through localstorage (only works after page refresh for now) //

$('.search-box').on('input', function() {
  var searchResult = $(this).val().toUpperCase();
  console.log(searchResult)
  var results = ideaArray.filter(function(idea) {
   return idea.title.toUpperCase().includes(searchResult) || idea.body.toUpperCase().includes(searchResult)
  })
  $('.bottom-section').empty();
 results.forEach(function(result){
   prependIdeaCard(result);
 })
})
