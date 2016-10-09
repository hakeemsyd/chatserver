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
  it('should broadcast new user/user left to all users', function(done){
    var client1 = io.connect(socketURL, options);
    var client2 = io.connect(socketURL, options);

    client1.on('user joined', function(data){
        data.username.should.equal('jhon');
        data.numUsers.should.equal(2);
    });

    client1.on('user left', function(data){
      data.username.should.equal('jhon');
      data.numUsers.should.equal(1);
      client1.disconnect();
      done();
    });

    client2.on('user joined', function(data){
      data.username.should.equal('hakeem');
      data.numUsers.should.equal(1);
      client2.disconnect();
    });

    client1.on('connect', function(){
      client1.emit('add user','hakeem');
    });

    client2.on('connect', function(){
      client2.emit('add user', 'jhon');
    });
  });
});
