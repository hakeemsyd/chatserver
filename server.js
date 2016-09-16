var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;

server.listen(port, function(){
  console.log('Server listening at port %d', port);
});

var numUsers = 0;

io.on('connection', function(socket){
  console.log('new client connected');
  var addedUser = false;

  socket.on('new message', function(data){
    console.log('new messge: ' + data + ', from: ' + socket.username);
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  socket.on('add user', function(username){
    console.log('add user: ' + username);
    if(addedUser) return;

    socket.username = username;
    ++numUsers;
    addedUser = true;

    socket.emit('login', { numUsers: numUsers});

    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });

  });

  socket.on('typing', function(){
    console.log('typing: ' + socket.username);
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  socket.on('stop typing', function(){
    console.log('stop typing: ' + socket.username);
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  socket.on('disconnect', function(){
    console.log('disconnect: ' + socket.username);

    if(addedUser){
      --numUsers;

      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
