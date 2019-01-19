var os = require('os'); os.tmpDir = os.tmpdir;
require('async-functions');
var fs = require('fs');
var SerialPort = require('serialport');
var InfiniteLoop = require('infinite-loop');
var ip = require('ip');
var il = new InfiniteLoop();

var port = new SerialPort('/dev/ttyACM0', {
	baudRate: 115200
});



var redGoals = 0;
var blueGoals = 0;
var started = false;
var playing = false;

const WebSocket = require('ws');
var connected = false;
var options = {rejectUnauthorized: false};
const ws = new WebSocket('wss://iafoosball.me:9003/tables/?tableID=table-1',options);
 
ws.on('open', function open() {
  //ws.send('something');
  console.log("Open ws");
  connected = true;
});

//Laser2 = redside

ws.on('message', function incoming(data) {
	console.log("Msg received");
	//read();
	console.log(data);
	try{
		var json = JSON.parse(data);
	if(json.started==undefined){
		json.started = false;
	}
	console.log("Started "+started+" json.started "+json.started);
	if(started==false&&json.started==true){
			il.add(game);
			il.run();
			arduino.async('21');
			playing = true;
	}
	if(playing&&json.started==false){
		if(redGoals>blueGoals){
			arduino.async('23');
		}else if(blueGoals>redGoals){
			arduino.async('22');
		}else{
			arduino.async('26');
		}
		redGoals = 0;
		blueGoals = 0;
		match_id = 0;	
		playing = false;
	}
	started = json.started;
	

	if(json.scoreRed!=redGoals){
		redGoals = json.scoreRed;
		arduino.async('"'+redGoals+'"');
	}
	if(json.scoreBlue!=blueGoals){
		blueGoals = json.scoreBlue;
		arduino.async('"'+(blueGoals+10)+'"');
	}
	}catch(e){
		console.log("Not valid json");
	}
	
});

console.log("start");

var arduino = function(str){
console.log("arduino");
port.write(str, function(err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
 		console.log('message written '+str);
		sleep.msleep(1200);
	});
}


function sendMsg(s) {
	console.log(ws.connected);
	if(connected){
		console.log("Sending ws");
		console.log(s);
		ws.send(s);
	}else{
		console.log("Not connected");
	}
	
}

var http = require('http');
var start = false;
var local_ip = ip.address();
var ElapsedTime = require('elapsed-time');
var sleep = require('sleep');


// Goal GPIO Inputs
var Gpio = require('pigpio').Gpio,
  //laser4 = new Gpio(23, {mode: Gpio.INPUT}),
  //laser3 = new Gpio(3, {mode: Gpio.INPUT}),
  laser2 = new Gpio(2, {mode: Gpio.INPUT});
  laser1 = new Gpio(18, {mode: Gpio.INPUT}),

function read(){
console.log('Laser1 '+laser1.digitalRead());
console.log('Laser2 '+laser2.digitalRead());
console.log("asd");

};


var hit1 = false;
var hit2 = false;

var et;

function game(){
var read1 = laser1.digitalRead();
var read2 = laser2.digitalRead();

if(read1==0){
	var command = ('{ "command": "addGoal", "values": { "speed": 0, "side": "red", "position": "attack"  }}');
	sendMsg(command);
	sleep.msleep(1200);
}
if(read2==0){
	var command = ('{ "command": "addGoal", "values": { "speed": 0, "side": "blue", "position": "attack"  }}');
	sendMsg(command);
	sleep.msleep(1200);
}

}
function sendData(s){
	if (connection.connected) {
		
		connection.sendUTF(number.toString());
		setTimeout(sendNumber, 1000);

}
}
