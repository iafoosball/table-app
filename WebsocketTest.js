#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
 
var client = new WebSocketClient();
var match_id = 0;
var speed = 0;

var redGoals = 0;
var blueGoals = 0;
 
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection) {
    console.log('Connected to IAfoosball');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            message.on('data', function (chunk)
		{
			var postdata = JSON.parse(chunk);
			if(postdata.Matchid){
				match_id = postdata.Matchid;
			}
			console.log("matchid: "+match_id);
			if(redGoals != postdata.score_red&&playing&&match_id!=0){
				sleep.msleep(1200);
				redGoals = postdata.score_red*1;
				}
			if(blueGoals != postdata.score_blue&&playing&&match_id!=0){
				sleep.msleep(1200);
				blueGoals = postdata.score_blue*1;
				}
			
			console.log(chunk);
		});
	

	    requestPost.on('error', function(e){
            console.log("Received: '" + message.utf8Data + "'");
        });
    };
});
    function sendNumber() {
        console.log('Send test String')
        connection.send ('{"command": "addGoal", "values"{ "side":"blue", "speed":' + 10 + ',"position": "attack"}}');
     
        
    }
sendNumber();
     
});
 
client.connect('ws://iafoosball.aau.dk:9003/tables/table-12');
    console.log('Connecting to IAfoosball...');