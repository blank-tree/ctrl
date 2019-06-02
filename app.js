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
var PATH_CTRL_0_NO_VOICEOVER = "video/ctrl-0-no_voiceover.mov";
var PATH_CTRL_0_VOICEOVER = "video/ctrl-0-voiceover.mov";
var PATH_CTRL_1 = "video/ctrl-1.mov";
var videoDuration = 307000; // in ms

// Application
var statusSwitch = false;
if (DEVICE_ID === 0) {
	var statusVoiceover = false;
}
var statusVideo = false;

// Omx
var Omx = require('node-omxplayer');
var player = Omx(DEVICE_ID === 0 ? PATH_CTRL_0_VOICEOVER : PATH_CTRL_1, 'both', true);
player.pause();

// GPIO
var Gpio = require('onoff').Gpio;
var button = new Gpio(PIN_BUTTON, 'in', 'both');
var switchVideo = new Gpio(PIN_SWITCH_VIDEO, 'in', 'both');
if (DEVICE_ID === 0) {
	var switchVoiceover = new Gpio(PIN_SWITCH_VOICEOVER, 'in', 'both');
}

// Button and Switches
button.watch((err, value) => {
	if (err) {
		console.log(err);
	}

	console.log('button pressed');

	if (!statusVideo && value === 1) {
		statusVideo = true;
		console.log('video started');

		if (statusSwitch) {
			if (DEVICE_ID === 0) {
				player.newSource(statusVoiceover ? 
					PATH_CTRL_0_VOICEOVER : PATH_CTRL_0_NO_VOICEOVER, 'both', true);
				console.log('video0 plays. voiceover: ' + statusVoiceover);
			} else {
				console.log('video1 plays');
			}
			player.play();
		}

		setTimeout(function() {
			statusVideo = false;
			player.rewind();
			player.play();
			player.pause();
			console.log('ready for next play');
		}, videoDuration);
	}
});

switchVideo.watch((err, value) => {
	if (err) {
		console.log(err);
	}

	statusSwitch = value === 1;
	console.log('status switch: ' + statusSwitch);
});

if (DEVICE_ID === 0) {
	switchVoiceover.watch((err, value) => {
		if (err) {
			console.log(err);
		}

		statusVoiceover = value === 1;
		console.log('voiceover switch: ' + statusVoiceover);
	});
}
