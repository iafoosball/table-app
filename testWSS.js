require('async-functions');

var redGoals = 0;
var blueGoals = 0;
var started = false;
var playing = false;

const WebSocket = require('ws');
var connected = false;
var options = {rejectUnauthorized: false};
const ws = new WebSocket('wss://iafoosball.me:9003/tables/table-2', options);

ws.on('open', function open() {
    console.log("Open ws");
    connected = true;
});

ws.on('message', function incoming(data) {
    console.log("Msg received");
    //read();
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

function sendMsg(s) {
    console.log(ws.connected);
    if (connected) {
        console.log("Sending ws");
        console.log(s);
        ws.send(s);
    } else {
        console.log("Not connected");
    }

}


// Goal GPIO Inputs


function sendData(s) {
    if (connection.connected) {

        connection.sendUTF(number.toString());
        setTimeout(sendNumber, 1000);

    }
}
