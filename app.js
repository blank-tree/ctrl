/*
 * ctrl - node application
 */

// Settings
var DEVICE_ID = 0;
var PIN_BUTTON = 2;
var PIN_SWITCH = 4;
var rPi = false;


// Application
var buttonStatus = false;

// GPIO
if (rPi) {
	var Gpio = require('onoff').Gpio;
	var button = new Gpio(PIN_BUTTON, 'in', 'both');
}

// Server
var express = require('express');
var http = require('http').Server;
var socket = require('socket.io');

let app = express();
let server = http(app);
let io = socket(server);

app.use(express.static('web'));

server.listen(3000, () => {
  console.log('listening on *:3000');
});


// Button
if (rPi) {
  button.watch((err, value) => {
    if (err) {
      console.log(err);
    }
    if (!check) {
      buttonStatus = value !== 1;
    }
  });
}

