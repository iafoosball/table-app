var os = require('os');
os.tmpDir = os.tmpdir;
require('async-functions');
var SerialPort = require('serialport');
var InfiniteLoop = require('infinite-loop');
var il = new InfiniteLoop();
setInterval(checkNightTime(), 60000);
var lightsOffNight = false;

var port = new SerialPort('/dev/ttyACM1', {
    baudRate: 115200
});


var redGoals = 0;
var blueGoals = 0;
var started = false;
var playing = false;

const WebSocket = require('ws');
var connected = false;
var options = {rejectUnauthorized: false};
const ws = new WebSocket('wss://iafoosball.me:9003/tables/?tableID=table-1', options);

ws.on('open', function open() {
    console.log("Open ws");
    connected = true;
});

ws.on('message', function incoming(data) {
    console.log("Msg received");
    console.log(data);
    try {
        var json = JSON.parse(data);
        if (json.started == undefined) {
            json.started = false;
        }
        console.log("Started " + started + " json.started " + json.started);
        if (started == false && json.started == true) {
            il.add(game);
            il.run();
            arduino.async('21');
            playing = true;
        }
        if (playing && json.started == false) {
            if (redGoals > blueGoals) {
                arduino.async('23');
            } else if (blueGoals > redGoals) {
                arduino.async('22');
            } else {
                arduino.async('26');
            }
            redGoals = 0;
            blueGoals = 0;
            match_id = 0;
            playing = false;
        }
        started = json.started;


        if (json.scoreRed != redGoals) {
            redGoals = json.scoreRed;
            arduino.async('"' + redGoals + '"');
        }
        if (json.scoreBlue != blueGoals) {
            blueGoals = json.scoreBlue;
            arduino.async('"' + (blueGoals + 10) + '"');
        }
    } catch (e) {
        console.log("Not valid json");
    }

});

function checkNightTime() {
    var date = new Date();
    if (lightsOffNight && date.getHours()>21 && date.getHours()<10) {
        mockTurnOffLights();
        lightsOffNight=true;
    }else {
        mockTurnOnLights();
        lightsOffNight=false;
    }
}

function mockTurnOffLights(){
    // arduino.async('lightsOff');
}

function mockTurnOnLights(){
    // arduino.async('lightsOn');
}


console.log("start");
var arduino = function (str) {
    console.log("arduino");
    port.write(str, function (err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('message written ' + str);
        sleep.msleep(1200);
    });
}

function sendMsg(s) {
    console.log(ws.connected);
    if (connected) {
        console.log("Sending ws");
        console.log(s);
        ws.send(s);
    } else {
        console.log("115200Not connected");
    }

}

var sleep = require('sleep');

var Gpio = require('pigpio').Gpio,
    laser2 = new Gpio(2, {mode: Gpio.INPUT});
laser1 = new Gpio(18, {mode: Gpio.INPUT}),

    function game() {
        var read1 = laser1.digitalRead();
        var read2 = laser2.digitalRead();

        if (read1 == 0) {
            var command = ('{ "command": "addGoal", "values": { "speed": 0, "side": "red", "position": "attack"  }}');
            sendMsg(command);
            sleep.msleep(1200);
        }
        if (read2 == 0) {
            var command = ('{ "command": "addGoal", "values": { "speed": 0, "side": "blue", "position": "attack"  }}');
            sendMsg(command);
            sleep.msleep(1200);
        }

    }