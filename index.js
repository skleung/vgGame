// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 4000;
var Parse = require('parse').Parse;
var leader_num = 0;

// Note: this JSON file is cached. So don't run any cron stuff on this script
var imageUrls = require('./images.json');
var stopWords = require('stopwords').english;

// initialize Parse
Parse.initialize("1k6XMysYQDS6Omh4nnnp7O4JkBh8vxeZfB8Q5w9e", "3NAHJYizOU4gfR7fesQXBEpQaXcW08peQugNLnfr");

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// scores which are currently connected to the chat
var scores = {};
var usernameArr = [];
var numUsers = 0;
var imageIndex = 0;

// overhead to track the sentences and the words
var freqMap = {};
var sentenceMap = {};
var sentence = "";
var sentenceArr = [];
var sentenceState = [];

function clearState(){
  freqMap = {};
  sentenceMap = {};
  sentence = "";
  sentenceArr = [];
  sentenceState = [];
}

var TIME_LIMIT = 30;
var MIN_NUM_USERS = 3;
var settingSentence = true;
var shouldShowResults = true;


// set the timer to 30 seconds
var countdown = 0;
var keepCounting = true

function startRound() {

  imageIndex = Math.floor(Math.random() * imageUrls.length);
  leader_num = (leader_num + 1) % numUsers;
  io.sockets.emit('start round',{
    numUsers: numUsers,
    imageUrl: imageUrls[imageIndex]["image"],
    leader: usernameArr[leader_num]
  });
  countdown = 0;
  shouldShowResults = true;
  keepCounting = true;
}

function saveAndShowResults(success) {
  var Annotation = Parse.Object.extend("Annotation");
  var newAnnotation = new Annotation();
  var data = {
    sentence: sentence,
    pk: imageUrls[imageIndex]["pk"],
    frequencyMap: JSON.stringify(freqMap),
    imageURL: imageUrls[imageIndex]["image"],
    gameFinished: success
  }

  newAnnotation.save(data).then(function(object) {
    if (success) {
      console.log("sentence successfully guessed! " + sentence);
    } else {
      console.log("timer ran out! saved sentence: " + sentence);
    }
  });

  io.sockets.emit('show results', {
    lastSentence: sentence,
    lastImageUrl: imageUrls[imageIndex]["image"],
    success: success
  });
  countdown = TIME_LIMIT;
  shouldShowResults = false;
}

setInterval(function() {
  if (!keepCounting) return;
  countdown--;
  if (countdown == 0) {
    if (shouldShowResults) {
      // save the sentence to parse
      // show results
      saveAndShowResults(false);
    } else {
      startRound();
    }

    if(settingSentence){
      // TODO: message that the leader did not set the message
    }

    settingSentence = true;
  }
  io.sockets.emit('timer', { countdown: countdown });
}, 1000);

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // update the frequency map
    data = data.trim();
    var wordArray = data.split(" ");
    for (var i=0; i<wordArray.length; i++) {
      var word = wordArray[i];
      if (word in freqMap) {
        freqMap[word]++;
      } else {
        freqMap[word] = 1;
      }
      if (word in sentenceMap) {
        if (freqMap[word] == 1) {
          // first hit scores a point
          if (stopWords.indexOf(word) >= 0) {
            scores[socket.username]++;
          } else {
            scores[socket.username]+=1;
          }
          updateState(word);

          socket.broadcast.emit('update score', {
            username: socket.username,
            word: word,
            state: sentenceState,
            scores: scores
          });
          socket.emit('hit word', {
            scores: scores,
            username: socket.username,
            state: sentenceState,
            word: word
          })
        } else {

          // hit word, but no score
          socket.emit('miss word', {
            word: word
          });
        }
      }
    }

    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list of scores and init to 0
    scores[username] = 0;
    usernameArr.push(username);
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers,
      scores: scores,
      usernames: usernameArr,
      sentence: sentence
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
      scores: scores
    });
    if(numUsers < MIN_NUM_USERS){
      socket.emit('wait',{
        numUsers: numUsers,
        usernames: usernameArr
      });
    }else{
      leader_num = 0;
      shouldShowResults = true;
      io.sockets.emit('start round',{
        numUsers: numUsers,
        imageUrl: imageUrls[imageIndex]["image"],
        leader: usernameArr[leader_num]
      });
    }
  });

  // when a user create the sentence, we broadcast the set sentence to everyone
  socket.on('create sentence', function (data) {
    clearState();
    // set the owner of the sentence
    owner = data.username;
    sentence = data.sentence;
    sentenceArr = sentence.split(/[ ,]+/);

    for (var i = 0; i < sentenceArr.length; i++) {
      word = sentenceArr[i];
      sentenceMap[word] = true;
      sentenceState.push("_____");
    }
    var startingWord = sentenceArr[Math.floor((Math.random() * sentenceArr.length))];
    while (stopWords.indexOf(startingWord) >= 0) {
      startingWord = sentenceArr[Math.floor((Math.random() * sentenceArr.length))];
    }
    updateState(startingWord);
    // reset timer when the sentence is created
    countdown = TIME_LIMIT;
    // echo globally (al

      l clients) that a sentence has been set
    socket.broadcast.emit('sentence set', {
      owner: owner,
      state: sentenceState
    });
  });

  function updateState(word) {
    for (var i = 0; i< sentenceArr.length; i++) {
      if (sentenceArr[i] === word) {
        sentenceState[i] = sentenceArr[i];
      }
    }

    // Game ends when we find no more blanks
    if (sentenceState.indexOf("_____") < 0) {
      saveAndShowResults(true);
    }
  }

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global scores list
    if (addedUser) {
      delete scores[socket.username];
      usernameArr.splice(usernameArr.indexOf(socket.username), 1);
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        scores: scores,
        numUsers: numUsers
      });

      if(numUsers < MIN_NUM_USERS){
        socket.broadcast.emit('wait',{
          numUsers: numUsers
        });
      }

    }
  });
});
