/*
 * ctrl - node application
 */

// Settings
var DEVICE_ID = 0;
var PIN_BUTTON = 23;
var PIN_SWITCH_VIDEO = 18;
if (DEVICE_ID === 0) {
	var PIN_SWITCH_VOICEOVER = 21;
}
var RPI = true;


// Application
// GPIO
if (RPI) {
	var Gpio = require('onoff').Gpio;
	var button = new Gpio(PIN_BUTTON, 'in', 'both');
	var switchVideo = new Gpio(PIN_SWITCH_VIDEO, 'in', 'both');
	if (DEVICE_ID === 0) {
		var switchVoiceover = new Gpio(PIN_SWITCH_VOICEOVER, 'in', 'both');
	}
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


// Button and Switches
// This is only being used, when running on a raspberry pi with the GPIO
// for testing purposes, the front end also has keyboard triggers
if (RPI) {
	button.watch((err, value) => {
		if (err) {
			console.log(err);
		}

		io.emit('button', value);
	});

	switchVideo.watch((err, value) => {
		if (err) {
			console.log(err);
		}

		io.emit('switch', value);
	});

	if (DEVICE_ID === 0) {
		switchVoiceover.watch((err, value) => {
			if (err) {
				console.log(err);
			}

			io.emit('voiceover', value);
		});
	}
}
