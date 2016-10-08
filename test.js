var io = require('socket.io-client');
var assert = require('assert');
var should = require('should');

socketURL = 'http://localhost:8080';

var options = {
  transport: ['websockets'],
  'force new connection': true
};

var user1 = {name: 'Jigger'};
var user2 = {name: 'hero'};
var user3 = {name: 'gamma'};

describe('Chat Server', function(){
  it('should broadcast new user to all users', function(done){
    var client1 = io.connect(socketURL, options);
    var client2 = io.connect(socketURL, options);
    client1.emit('add user','hakeem');
    client1.disconnect();
    done();
/*
    client1.on('connection',function(data){
      client1.emit('connection name', chatUser1);

      var client2 = io.connect(socketURL, options);

      client2.on('connection', function(data){
        client2.emit('connection name', chatUser2);
      });
    });*/
  });
});
