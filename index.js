// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 4000;
var leader_num = 0;
// Note: this JSON file is cached. So don't run any cron stuff on this script
// var imageUrls = require('./image.json');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

// overhead to track the sentences and the words
var freqMap = {};
var sentence = "";
var remainingWords = {};

var TIME_LIMIT = 30;
var MIN_NUM_USERS = 4;
// set the timer to 2 minutes
var countdown = TIME_LIMIT;
setInterval(function() {
  countdown--;
  io.sockets.emit('timer', { countdown: countdown });
}, 1000);

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('reset', function (data) {
    countdown = TIME_LIMIT;
    sentence = "";
    io.sockets.emit('timer', { countdown: countdown });
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
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
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers,
      usernames: usernames,
      sentence: sentence
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
      usernames: usernames
    });
    if(numUsers < MIN_NUM_USERS){
      socket.broadcast.emit('wait',{
        numUsers: numUsers
      });
    }else{
      leader_num = 0;
      socket.broadcast.emit('start play',{
        numUsers: numUsers,
        leader: usernames[leader_num]
      });
    }
  });

  // when a user create the sentence, we broadcast the set sentence to everyone
  socket.on('create sentence', function (data) {
    // set the owner of the sentence
    owner = data.username;
    sentence = data.sentence;
    // reset timer when the sentence is created
    countdown = TIME_LIMIT;
    // echo globally (all clients) that a sentence has been set
    socket.broadcast.emit('sentence set', {
      owner: owner
    });
  });

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
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
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
