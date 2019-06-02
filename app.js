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
var player = Omx(DEVICE_ID === 0 ? PATH_CTRL_0_VOICEOVER : PATH_CTRL_1);

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

	if (!statusVideo) {
		statusVideo = true;

		if (statusSwitch) {
			if (DEVICE_ID === 0) {
				player.newSource(switchVoiceover ? 
					PATH_CTRL_0_VOICEOVER : PATH_CTRL_0_NO_VOICEOVER);
			}
			player.play();
		}

		setTimeout(function() {
			statusVideo = false;
			player.rewind();
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

		switchVoiceover = value === 1;
		console.log('voiceover switch: ' + switchVoiceover);
	});
}
