var io = require('socket.io-client');
var assert = require('assert');
var should = require('should');

socketURL = 'http://localhost:8080';

var options = {
  transport: ['websockets'],
  'force new connection': true
};

var user1 =  'hero';
var user2 = 'gamma';

describe('Chat Server', function(){
  it('should broadcast new user/user left to all users', function(done){
    var client1 = io.connect(socketURL, options);
    var client2 = io.connect(socketURL, options);

    client1.on('user joined', function(data){
        data.username.should.equal(user2);
        data.numUsers.should.equal(2);
    });

    client1.on('user left', function(data){
      data.username.should.equal(user2);
      data.numUsers.should.equal(1);
      client1.disconnect();
      done();
    });

    client2.on('user joined', function(data){
      data.username.should.equal(user1);
      data.numUsers.should.equal(1);
      client2.disconnect();
    });

    client1.on('connect', function(){
      client1.emit('add user', user1);
    });

    client2.on('connect', function(){
      client2.emit('add user', user2);
    });
  });
});

describe('Chat Server', function(){
  it('should broadcast message to all users', function(done){
    var client1 = io.connect(socketURL, options);
    var client2 = io.connect(socketURL, options);

    client1.on('user joined', function(data){
      client1.emit('new message', 'Hello from ' + user1);
    });

    client1.on('new message', function(data){
      data.message.should.equal('Hello from ' + user2);
      data.username.should.equal(user2);
      client1.disconnect();
      done();
    });

    client2.on('user joined', function(data){
      client2.emit('new message', 'Hello from ' + user2);
    });

    client2.on('new message', function(data){
      data.message.should.equal('Hello from ' + user1);
      data.username.should.equal(user1);
      client2.disconnect();
    });

    client1.on('connect', function(){
      client1.emit('add user', user1);
    });

    client2.on('connect', function(){
      client2.emit('add user', user2);
    });
  });
});
