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
  var stopWords = [ 'a', 'able', 'about', 'above', 'abroad', 'according', 'accordingly', 'across', 'actually', 'adj', 'after', 'afterwards', 'again', 'against', 'ago', 'ahead', 'aint', 'all', 'allow', 'allows', 'almost', 'alone', 'along', 'alongside', 'already', 'also', 'although', 'always', 'am', 'amid', 'amidst', 'among', 'amongst', 'an', 'and', 'another', 'any', 'anybody', 'anyhow', 'anyone', 'anything', 'anyway', 'anyways', 'anywhere', 'apart', 'appear', 'appreciate', 'appropriate', 'are', 'arent', 'around', 'as', 'as', 'aside', 'ask', 'asking', 'associated', 'at', 'available', 'away', 'awfully', 'b', 'back', 'backward', 'backwards', 'be', 'became', 'because', 'become', 'becomes', 'becoming', 'been', 'before', 'beforehand', 'begin', 'behind', 'being', 'believe', 'below', 'beside', 'besides', 'best', 'better', 'between', 'beyond', 'both', 'brief', 'but', 'by', 'c', 'came', 'can', 'cannot', 'cant', 'cant', 'caption', 'cause', 'causes', 'certain', 'certainly', 'changes', 'clearly', 'cmon', 'co', 'co.', 'com', 'come', 'comes', 'concerning', 'consequently', 'consider', 'considering', 'contain', 'containing', 'contains', 'corresponding', 'could', 'couldnt', 'course', 'cs', 'currently', 'd', 'dare', 'darent', 'definitely', 'described', 'despite', 'did', 'didnt', 'different', 'directly', 'do', 'does', 'doesnt', 'doing', 'done', 'dont', 'down', 'downwards', 'during', 'e', 'each', 'edu', 'eg', 'eight', 'eighty', 'either', 'else', 'elsewhere', 'end', 'ending', 'enough', 'entirely', 'especially', 'et', 'etc', 'even', 'ever', 'evermore', 'every', 'everybody', 'everyone', 'everything', 'everywhere', 'ex', 'exactly', 'example', 'except', 'f', 'fairly', 'far', 'farther', 'few', 'fewer', 'fifth', 'first', 'five', 'followed', 'following', 'follows', 'for', 'forever', 'former', 'formerly', 'forth', 'forward', 'found', 'four', 'from', 'further', 'furthermore', 'g', 'get', 'gets', 'getting', 'given', 'gives', 'go', 'goes', 'going', 'gone', 'got', 'gotten', 'greetings', 'h', 'had', 'hadnt', 'half', 'happens', 'hardly', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hello', 'help', 'hence', 'her', 'here', 'hereafter', 'hereby', 'herein', 'heres', 'hereupon', 'hers', 'herself', 'hes', 'hi', 'him', 'himself', 'his', 'hither', 'hopefully', 'how', 'howbeit', 'however', 'hundred', 'i', 'id', 'ie', 'if', 'ignored', 'ill', 'im', 'immediate', 'in', 'inasmuch', 'inc', 'inc.', 'indeed', 'indicate', 'indicated', 'indicates', 'inner', 'inside', 'insofar', 'instead', 'into', 'inward', 'is', 'isnt', 'it', 'itd', 'itll', 'its', 'its', 'itself', 'ive', 'j', 'just', 'k', 'keep', 'keeps', 'kept', 'know', 'known', 'knows', 'l', 'last', 'lately', 'later', 'latter', 'latterly', 'least', 'less', 'lest', 'let', 'lets', 'like', 'liked', 'likely', 'likewise', 'little', 'look', 'looking', 'looks', 'low', 'lower', 'ltd', 'm', 'made', 'mainly', 'make', 'makes', 'many', 'may', 'maybe', 'maynt', 'me', 'mean', 'meantime', 'meanwhile', 'merely', 'might', 'mightnt', 'mine', 'minus', 'miss', 'more', 'moreover', 'most', 'mostly', 'mr', 'mrs', 'much', 'must', 'mustnt', 'my', 'myself', 'n', 'name', 'namely', 'nd', 'near', 'nearly', 'necessary', 'need', 'neednt', 'needs', 'neither', 'never', 'neverf', 'neverless', 'nevertheless', 'new', 'next', 'nine', 'ninety', 'no', 'nobody', 'non', 'none', 'nonetheless', 'noone', 'no-one', 'nor', 'normally', 'not', 'nothing', 'notwithstanding', 'novel', 'now', 'nowhere', 'o', 'obviously', 'of', 'off', 'often', 'oh', 'ok', 'okay', 'old', 'on', 'once', 'one', 'ones', 'ones', 'only', 'onto', 'opposite', 'or', 'other', 'others', 'otherwise', 'ought', 'oughtnt', 'our', 'ours', 'ourselves', 'out', 'outside', 'over', 'overall', 'own', 'p', 'particular', 'particularly', 'past', 'per', 'perhaps', 'placed', 'please', 'plus', 'possible', 'presumably', 'probably', 'provided', 'provides', 'q', 'que', 'quite', 'qv', 'r', 'rather', 'rd', 're', 'really', 'reasonably', 'recent', 'recently', 'regarding', 'regardless', 'regards', 'relatively', 'respectively', 'right', 'round', 's', 'said', 'same', 'saw', 'say', 'saying', 'says', 'second', 'secondly', 'see', 'seeing', 'seem', 'seemed', 'seeming', 'seems', 'seen', 'self', 'selves', 'sensible', 'sent', 'serious', 'seriously', 'seven', 'several', 'shall', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'since', 'six', 'so', 'some', 'somebody', 'someday', 'somehow', 'someone', 'something', 'sometime', 'sometimes', 'somewhat', 'somewhere', 'soon', 'sorry', 'specified', 'specify', 'specifying', 'still', 'sub', 'such', 'sup', 'sure', 't', 'take', 'taken', 'taking', 'tell', 'tends', 'th', 'than', 'thank', 'thanks', 'thanx', 'that', 'thatll', 'thats', 'thats', 'thatve', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'thence', 'there', 'thereafter', 'thereby', 'thered', 'therefore', 'therein', 'therell', 'therere', 'theres', 'theres', 'thereupon', 'thereve', 'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'thing', 'things', 'think', 'third', 'thirty', 'this', 'thorough', 'thoroughly', 'those', 'though', 'three', 'through', 'throughout', 'thru', 'thus', 'till', 'to', 'together', 'too', 'took', 'toward', 'towards', 'tried', 'tries', 'truly', 'try', 'trying', 'ts', 'twice', 'two', 'u', 'un', 'under', 'underneath', 'undoing', 'unfortunately', 'unless', 'unlike', 'unlikely', 'until', 'unto', 'up', 'upon', 'upwards', 'us', 'use', 'used', 'useful', 'uses', 'using', 'usually', 'v', 'value', 'various', 'versus', 'very', 'via', 'viz', 'vs', 'w', 'want', 'wants', 'was', 'wasnt', 'way', 'we', 'wed', 'welcome', 'well', 'well', 'went', 'were', 'were', 'werent', 'weve', 'what', 'whatever', 'whatll', 'whats', 'whatve', 'when', 'whence', 'whenever', 'where', 'whereafter', 'whereas', 'whereby', 'wherein', 'wheres', 'whereupon', 'wherever', 'whether', 'which', 'whichever', 'while', 'whilst', 'whither', 'who', 'whod', 'whoever', 'whole', 'wholl', 'whom', 'whomever', 'whos', 'whose', 'why', 'will', 'willing', 'wish', 'with', 'within', 'without', 'wonder', 'wont', 'would', 'wouldnt', 'x', 'y', 'yes', 'yet', 'you', 'youd', 'youll', 'your', 'youre', 'yours', 'yourself', 'yourselves', 'youve', 'z', 'zero' ];
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $sentenceInput = $('.sentenceInput'); // Input for username
  var $sentenceInputWrapper = $('#sentenceInputWrapper'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box
  var $errorMessage = $('.errorMessage'); // Input message input box
  var $usernameInputError = $('.usernameInputError'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page
  var $sentencePage = $('.sentence.page'); // The chatroom page
  var $waitingPage = $('.waiting.page'); // The waiting page
  var $resultsPage = $('.results.page'); // The waiting page
  var $waitingMessage= $('#waitingMessage'); // The waiting page
  var $waitingUsers= $('#waitingUsers'); // The waiting page

  var $nextButton = $('#next');
  var $sentence = $('#sentence'); // Input message input box
  var $lastSentence = $('#lastSentence');
  var $success = $('.success');
  var $failure = $('#failure');
  var $flagSentenceBtn = $(".flagSentence");
  var $lastImage = $('#lastImage');
  var $lastRound = $('.lastRound');
  var $scoreboard = $('#scoreboard');
  var $counter = $('.counter');

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();
  var $sentenceInput = $sentenceInput.focus();

  var TRANSITION_TIME_LIMIT = 7;
  var GAME_TIME_LIMIT = 45;

  var $reset = $("#reset");
  $reset.hide();
  $sentencePage.hide();
  $resultsPage.hide();
  $lastRound.hide();
  $waitingPage.hide();

  var socket = io();
  socket.on('timer', function (data) {
    $counter.html(data.countdown);
    if (data.countdown <= 0) {
      $counter.html("");
      $counter.css("color", "red");
      $reset.fadeIn();
    } else {
      $counter.css("color", "#aaa");
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
    var username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
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
      $inputMessage.val("Your chat box is disabled because you set the sentence.")
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
      // validate the sentence
      var sentence = $sentenceInput.val();
      if (sentence.split(" ").length < 4) {
        $sentenceInputWrapper.addClass("has-error");
        $sentenceInput.css("border-bottom", "5px solid #a94442");
        $errorMessage.text("Please enter a sentence with at least 4 words");
        return;
      }
      var onlystop = true;
      var ss = sentence.split(" ");
      for (var i = 0; i<ss.length; i++){
        if (stopWords.indexOf(ss[i]) < 0) {
          onlystop = false;
        }
      }
      if (onlystop){
        $sentenceInputWrapper.addClass("has-error");
        $sentenceInput.css("border-bottom", "5px solid #a94442");
        $errorMessage.text("Please enter a valid sentence");
        return;
      }

      $sentenceInput.css("border-bottom", "2px solid #000");
      // set the sentence and send to the server
      setSentence();
    }
  });

  $flagSentenceBtn.click(function() {
    flagSentence();
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
    username = data.username;
    $loginPage.fadeOut();
    $loginPage.off('click');
    $currentInput = $inputMessage.focus();
    $usernameInput.css('border-bottom', '2px solid white');
    $usernameInputError.hide();
    setImage(data);
    // Display the welcome message
    var message = "Welcome to vgChat – ";
    log(message, {
      prepend: true
    });

    if(data.numUsers < MIN_NUM_PLAYERS){
      showWaitingPage(data);
    }else{
      showChatPage();
    }

    addParticipantsMessage(data);
    updateScores(data, false);
    updateState(data);
  });

  socket.on('error login', function (data){
    $usernameInput.css('border-bottom', '5px solid red');
    $usernameInputError.text(data.username + " has already been taken!");
    $usernameInputError.show();
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  // Whenever the server emits 'sentence set' we can start the game
  socket.on('sentence set', function (data) {
    log(data.owner + " has set the sentence!");
    $counter.html(data.countdown);
    $inputMessage.val("");
    $inputMessage.prop('disabled', false);
    updateState(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
    updateScores(data);
  });

  socket.on('join round', function(data){
    showChatPage();
    updateState(data);
  });

  function setImage(data) {
    $(".curImage").attr('src', data.imageUrl);
    // resize image appropriately
    var fillClass = ($(".curImage").height() > $(".curImage").width()) ? 'fillheight' : 'fillwidth';
    $(".curImage").removeClass('fillheight');
    $(".curImage").removeClass('fillwidth');
    $(".curImage").addClass(fillClass);
  }

  function updateState(data) {
    if ($counter.html()){
      $sentence.empty();
      $sentence.html(data.state.join([separator = ' ']));
    }
  }

  function updateScores(data, animated) {
    $scoreboard.html("");
    for (user in data.scores) {
      console.log(data.scores);
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
    if(username) showWaitingPage(data);
  });

  // Whenever a user hits a word by themselves
  socket.on('hit word', function (data) {
    $('#bing-sound').get(0).play();
    log("Congrats - you correctly guessed '" + data.word+"'!");
    updateScores(data, true);
    updateState(data);
  });

  socket.on('update score', function(data) {
    $('#ping-sound').get(0).play();
    log(data.username + " correctly guessed '" + data.word + "'!");
    updateScores(data, true);
    updateState(data);
  });

  socket.on('show results', function(data) {
    if(username){
      $inputMessage.prop('disabled', false);
      showResultsPage();
      if (data.success) {
        $('#success-sound').get(0).play();
        $success.show();
      } else {
        $('#fail-sound').get(0).play();
        $failure.show();
      }
      $lastSentence.text(data.lastSentence);
      $(".curRound").text(data.curRound);
      $(".totalRounds").text(data.totalRounds);
      setImage(data);
      // set and resize image appropriately
      $lastImage.attr('src', data.lastImageUrl);
      var fillClass = ($(".curImage").height() > $(".curImage").width()) ? 'fillheight' : 'fillwidth';
      $lastImage.removeClass('fillheight');
      $lastImage.removeClass('fillwidth');
      $lastImage.addClass(fillClass);

      if (data.isLastRound) {
        $('.winner').text(data.winner);
        var color = getUsernameColor(username);
        $('.winner').css("color", color);
        $('.maxScore').text(data.maxScore);
        $lastRound.show();
        $("#nextRoundText").hide();
      } else {
        $lastRound.hide();
        $("#nextRoundText").show();
      }
    }
  });
  // Whenever the server tells us that we can play the game
  socket.on('start round', function(data) {
    if(username){
      setImage(data);
      // center the image
      // setTimeout(function(){
      //   $('.curImage').attr('style', '');
      //   $(".curImage").css('position', 'relative');
      //   $(".curImage").css('left', '50%');
      //   console.log("width = " + $(".curImage").width());
      //   console.log("half = " + $(".curImage").width()/2.0);
      //   $(".curImage").css('margin-left', "-"+ $(".curImage").width()/2.0+'px');
      // }, 0);
      if(data.leader == username){
        showSentencePage();
      }else{
        showChatPage();
        $inputMessage.val("");
        log(data.leader + " is currently setting the sentence.", {
          prepend: true
        });

        var color = getUsernameColor(data.leader);
        var html = "<strong style='color:" + color + "'> " + data.leader + " </strong> is currently setting the sentence."
        $("#sentence").html(html);
      }
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

  function flagSentence() {
    socket.emit('flag sentence', {
      lastSentence: $lastSentence.text()
    });
  }

  function showChatPage(){
    $waitingPage.hide();
    $resultsPage.hide();
    $lastRound.hide();
    $chatPage.show();
    $loginPage.hide();
    $sentencePage.hide();
  }

  function showWaitingPage(data){
    var usernameHTML = "";
    if (data.numUsers === 1) {
      $waitingMessage.text("You're the only one in the room right now - share it with your friends!")
    } else {
      $waitingMessage.html("There are " + data.numUsers + " players in the room right now: ");
      for (var i=0; i<data.usernames.length; i++) {
        var username = data.usernames[i];
        var color = getUsernameColor(username);
        usernameHTML += "<strong style='color:" + color + "'> " + username + " </strong> "
      }
    }
    $waitingUsers.html(usernameHTML);
    $resultsPage.hide();
    $lastRound.hide();
    $waitingPage.show();
    $sentencePage.hide();
    $loginPage.hide();
    $chatPage.hide();
  }
  function showSentencePage(){
    $resultsPage.hide();
    $lastRound.hide();
    $sentencePage.show();
    $sentenceInput.val("");
    $sentenceInput.focus();
    $waitingPage.hide();
    $loginPage.hide();
    $chatPage.hide();
  }

  function showResultsPage(){
    $success.hide();
    $failure.hide();
    $resultsPage.show();
    $sentencePage.hide();
    $sentenceInput.focus();
    $waitingPage.hide();
    $loginPage.hide();
    $chatPage.hide();
  }
});

// Prevent the backspace key from navigating back.
$(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent = false;
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === 'INPUT' &&
             (
                 d.type.toUpperCase() === 'TEXT' ||
                 d.type.toUpperCase() === 'PASSWORD' ||
                 d.type.toUpperCase() === 'FILE' ||
                 d.type.toUpperCase() === 'EMAIL' ||
                 d.type.toUpperCase() === 'SEARCH' ||
                 d.type.toUpperCase() === 'DATE' )
             ) ||
             d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        }
        else {
            doPrevent = true;
        }
    }

    if (doPrevent) {
        event.preventDefault();
    }
});
