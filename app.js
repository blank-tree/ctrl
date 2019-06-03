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
var PATH_DIRECTORY = "video/";
var PATH_CTRL_0_NO_VOICEOVER = PATH_DIRECTORY + "ctrl-0-no_voiceover.mov";
var PATH_CTRL_0_NO_VOICEOVER_BLANK = PATH_DIRECTORY + "ctrl-0-no_voiceover-blank.mov";
var PATH_CTRL_0_VOICEOVER = PATH_DIRECTORY + "ctrl-0-voiceover.mov";
var PATH_CTRL_0_VOICEOVER_BLANK = PATH_DIRECTORY + "ctrl-0-voiceover-blank.mov";
var PATH_CTRL_1 = PATH_DIRECTORY + "ctrl-1.mov";
var PATH_CTRL_1_BLANK = PATH_DIRECTORY + "ctrl-1-blank.mov";

// Application
var statusSwitch = false;
if (DEVICE_ID === 0) {
	var statusVoiceover = false;
}
var statusVideo = false;

// Omx
var omxSettings = {
	'-o': 'both',
	'p': true,
	'--blank': true,
	'--no-osd': true,
	'--no-keys': true
};
var OmxManager = require('omx-manager');
var manager = new OmxManager(); // OmxManager
// var camera = manager.create('video.avi'); // OmxInstance
// camera.play(); // Will start the process to play videos

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

		if (DEVICE_ID === 0) {
			if (statusSwitch) {
				console.log('ctrl0 playing. voiceover: ' + statusVoiceover);
				var player = manager.create(statusVoiceover ? PATH_CTRL_0_VOICEOVER : PATH_CTRL_0_NO_VOICEOVER, omxSettings);
			} else {
				console.log('ctrl0 playing blank. voiceover: ' + statusVoiceover);
				var player = manager.create(statusVoiceover ? PATH_CTRL_0_VOICEOVER_BLANK : PATH_CTRL_0_NO_VOICEOVER_BLANK, omxSettings);
			}
		} else {
			if (statusSwitch) {
				console.log('ctrl1 playing');
				var player = manager.create(PATH_CTRL_1, omxSettings);
			} else {
				console.log('ctrl1 playing blank');
				var player = manager.create(PATH_CTRL_1_BLANK, omxSettings);
			}
		}

		player.play();

		player.on('end', function() {
			statusVideo = false;
			console.log('ready for next play');
		});
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
