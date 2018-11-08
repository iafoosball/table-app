#!/usr/bin/env node
var util = require('util');
var EventEmitter = require('events');
function MyClass() {
    EventEmitter.call(this)
}
util.inherits(MyClass, EventEmitter);
var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();
var match_id = 0;
var speed = 0;

var redGoals = 0;
var blueGoals = 0;

client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            handleServerData(message.utf8Data)
        }
    });

    function handleServerData() {

    }

    function sendCommand(command) {
        connection.send(command);
    }

    sendCommand('{"command": "addGoal", "values":{ "side":"blue", "speed":10,"position": "attack"}}');

});


client.connect('ws://0.0.0.0:9003/tables/table-12');
console.log('Connecting to IAfoosball...');