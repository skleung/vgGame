$(function() {
  // var VG = require('./VG.js');
  var MIN_NUM_PLAYERS = 3;
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize varibles
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $sentenceInput = $('.sentenceInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page
  var $sentencePage = $('.sentence.page'); // The chatroom page
  var $waitingPage = $('.waiting.page'); // The waiting page
  var $waitingMessage= $('#waitingMessage'); // The waiting page
  var $waitingUsers= $('#waitingUsers'); // The waiting page

  var $nextButton = $('#next');
  var $sentence = $('#sentence'); // Input message input box
  var $scoreboard = $('#scoreboard');

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();
  var $sentenceInput = $sentenceInput.focus();

  var $reset = $("#reset");
  $reset.hide();
  $sentencePage.hide();
  $waitingPage.hide();

  var socket = io();
  socket.on('timer', function (data) {
    $('#counter').html(data.countdown);
    if (data.countdown <= 0) {
      $('#counter').html(0);
      $('#counter').css("color", "red");
      $reset.fadeIn();
    } else {
      $('#counter').css("color", "#aaa");
    }
  });

  $reset.click(function() {
      $reset.hide()
      socket.emit('reset');
  });
  function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 player";
    } else {
      message += "there are " + data.numUsers + " players";
    }
    log(message);
  }

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      var color = getUsernameColor(username);
      var score = 0;
      $scoreboard.append("<li style='color:"+ color +"'><b>"+ username + ": "+ score + "</b></li>");

      // Tell the server your username
      socket.emit('add user', username);
    }
  }

  // Sets the sentence
  function setSentence () {
    var sentence = cleanInput($sentenceInput.val().trim());

    // If the username is valid
    if (sentence) {
      $sentencePage.fadeOut();
      showChatPage();
      $sentencePage.off('click');
      $currentInput = $inputMessage.focus();

      log("You set the sentence!");
      // disable the chatting ability!
      $inputMessage.prop('disabled', true);
      $sentence.html(sentence);
      // Tell the server who you are and the sentence you set
      data = {
        username: username,
        sentence: sentence
      }

      socket.emit('create sentence', data);
    }
  }

  // Sends a chat message
  function sendMessage() {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
  function log(message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Retrieves an array of sentence objects
  function getSentences() {
    if (!localStorage.sentences) {
      // default to empty array
      localStorage.sentences = JSON.stringify([]);
    }
    return JSON.parse(localStorage.sentences);
  }

  // Stores an array of sentences
  function storeSentences(sentences) {
    localStorage.sentences = JSON.stringify(sentences);
  }

    // Retrieves an array of sentence objects
  function getMySentences() {
    if (!localStorage.mySentences) {
      // default to empty array
      localStorage.mySentences = JSON.stringify([]);
    }
    return JSON.parse(localStorage.mySentences);
  }

  // Stores an array of sentences
  function storeMySentences(sentences) {
    localStorage.mySentences = JSON.stringify(sentences);
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

  // Adds the visual chat typing message
  function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing';
    // addChatMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Updates the typing event
  function updateTyping () {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages (data) {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $(".chat").keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $(".login").keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $(".sentence.page").keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $sentenceInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      setSentence();
    }
  });

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to vgChat – ";
    log(message, {
      prepend: true
    });

    if(data.numUsers < MIN_NUM_PLAYERS){
      showWaitingPage();
    }else{
      showChatPage();
    }

    addParticipantsMessage(data);
    updateScores(data, false);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  // Whenever the server emits 'sentence set' we can start the game
  socket.on('sentence set', function (data) {
    log(data.owner + " has set the sentence!");
    $inputMessage.prop('disabled', false);
    updateState(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
    updateScores(data);
  });

  function updateState(data) {
    $sentence.html(data.state.join([separator = ' ']));
  }

  function updateScores(data, animated) {
    $scoreboard.html("");
    for (user in data.scores) {
      var color = getUsernameColor(user);
      var score = data.scores[user];
      if (user == username) {
        $scoreboard.append("<li id='" + user + "Score' style='color:"+ color +"'><strong>"+ user + ": "+ score + "</strong></li>");
      } else {
        $scoreboard.append("<li id='" + user + "Score' style='color:"+ color +"'>"+ user + ": "+ score + "</li>");
      }
    }
    // animate the score of the person who just scored
    $("#" + data.username + "Score").addClass("animated bounce");
  }

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.username + ' left');
    updateScores(data, false);
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server tells us to wait
  socket.on('wait', function (data) {
    showWaitingPage(data);
  });

  // Whenever a user hits a word by themselves
  socket.on('hit word', function (data) {
    log("Congrats - you correctly guessed " + data.word);
    updateScores(data, true);
    updateState(data);
  });

  socket.on('update score', function(data) {
    log(data.username + " correctly guessed <strong>'" + data.word) + "'</strong>!";
    updateScores(data, true);
    updateState(data);
  });

  // Whenever the server tells us that we can play the game
  socket.on('start round', function(data){
    console.log(data);
    console.log("starting round");
    $(".curImage").attr('src', data.imageUrl);
    if(data.leader == username){
      showSentencePage();
    }else{
      showChatPage();
      log(data.leader + " is currently setting the sentence.", {
        prepend: true
      });
    }
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });

  function showChatPage(){
    $waitingPage.hide();
    $chatPage.show();
    $loginPage.hide();
    $sentencePage.hide();
  }

  function showWaitingPage(data){
    if (data.numUsers === 1) {
      $waitingMessage.text("You're the only one in the room right now - share it with your friends!")
    } else {
      $waitingMessage.html("There are " + data.numUsers + " players in the room right now: ");
      var usernameHTML = "";
      for (var i=0; i<data.usernames.length; i++) {
        var username = data.usernames[i];
        var color = getUsernameColor(username);
        usernameHTML += "<strong style='color:" + color + "'> " + username + " </strong> "
      }
      $waitingUsers.html(usernameHTML);
    }
    $waitingPage.show();
    $sentencePage.hide();
    $loginPage.hide();
    $chatPage.hide();
  }
  function showSentencePage(){
    $sentencePage.show();
    $sentenceInput.focus();
    $waitingPage.hide();
    $loginPage.hide();
    $chatPage.hide();
  }
});
