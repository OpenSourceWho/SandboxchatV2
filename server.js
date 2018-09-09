var app = require('express')(),
http = require('http').Server(app),
io = require('socket.io')(http),
ifhtml = require('is-html'),
nicknames = [];

io.set('log level',0);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/credits', function(req, res){
  res.sendFile(__dirname + '/public/credits.html');
});

app.get('/chat', function(req, res){
  if(!req.query.username) {
    res.send('<h1>You need a username.</h1>');
  }else{
    res.sendFile(__dirname + '/public/chat.html');
    io.emit('create_user', { username: req.query.username });
  }
});

app.get('/error', function(req, res){
  if(!req.query.error) {
    res.send('<h1>Error: no query for error</h1>');
  } else {
    res.send('<h1>Error: ' + req.query.error + '</h1>');
  }
});

app.get('/js/main.js', function(req, res){
  res.sendFile(__dirname + '/public/js/main.js');
});

app.get('/js/socket.io.js', function(req, res){
  res.sendFile(__dirname + '/public/js/socket.io.js');
});

app.get('/js/jquery.js', function(req, res){
  res.sendFile(__dirname + '/public/js/jquery.js');
});

io.on('connection', function(socket){
  console.log('An user connected.');
  socket.on('disconnect', function(){
    if(socket.nickname){
      return false;
      nicknames.pop(socket.nickname);
      console.log(socket.nickname + ' disconnected.');
    }else{
      console.log('An user disconnected.');
    }
  });
  socket.on('create_user', function(data){
    if(ifhtml(socket.username) == true){
      socket.emit('create_user', { error: 'The username you used has HTML.' });
    }else{
      socket.nickname = data.username
      nicknames.unshift(socket.nickname);
      console.log(socket.nickname + ' connected to the chat.');
    }
  });
  socket.on('new_message', function(data){
    if(ifhtml(socket.message) == true){
      socket.emit('new_message', { error: 'The message you sent has HTML.' });
    }else{
      io.emit('new_message', { username: data.username, message: data.message });
    }
  });
  socket.on('get_users', function(data){
    socket.emit('get_users', { users: nicknames.toString() });
  });
});

http.listen(8080, function(){
  console.log('listening on :3000!');
});
