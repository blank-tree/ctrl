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
var PATH_BLANK = PATH_DIRECTORY + "blank.mov";

// Application
var statusSwitch = false;
if (DEVICE_ID === 0) {
	var statusVoiceover = false;
}
var statusVideo = false;

// Omx
var omxSettings = {
	'--blank': true,
	'--no-osd': true,
	'-o': 'local'
};
var OmxManager = require('omx-manager');
var manager = new OmxManager(); // OmxManager
// var camera = manager.create('video.avi'); // OmxInstance
// camera.play(); // Will start the process to play videos
var player = manager.create(PATH_BLANK, omxSettings);
player.play();
player.pause();

// GPIO
var Gpio = require('onoff').Gpio;
var button = new Gpio(PIN_BUTTON, 'in', 'both');
var switchVideo = new Gpio(PIN_SWITCH_VIDEO, 'in', 'both');
if (DEVICE_ID === 0) {
	var switchVoiceover = new Gpio(PIN_SWITCH_VOICEOVER, 'in', 'both');
}

// Video Functions
function startVideo() {
	statusVideo = true;

	var currentVideoPath = DEVICE_ID === 0 ? PATH_CTRL_0_VOICEOVER : PATH_CTRL_1;
	if (DEVICE_ID === 0) {
		if (statusSwitch) {
			currentVideoPath = statusVoiceover ? PATH_CTRL_0_VOICEOVER : PATH_CTRL_0_NO_VOICEOVER;
			console.log('ctrl0 playing. voiceover: ' + statusVoiceover);
		} else {
			currentVideoPath = statusVoiceover ? PATH_CTRL_0_VOICEOVER_BLANK : PATH_CTRL_0_NO_VOICEOVER_BLANK;
			console.log('ctrl0 playing blank. voiceover: ' + statusVoiceover);
		}
	} else {
		if (statusSwitch) {
			currentVideoPath = PATH_CTRL_1;
			console.log('ctrl1 playing');
		} else {
			currentVideoPath = PATH_CTRL_1_BLANK;
			console.log('ctrl1 playing blank');
		}
	}

	player.stop();
	player = manager.create(currentVideoPath, omxSettings);
	player.play();

	console.log('video started');

	player.on('end', function() {
		statusVideo = false;
		startBlank();
		console.log('ready for next play');
	});
}

function startBlank() {
	// player.stop();
	player = manager.create(PATH_BLANK, omxSettingsLoop);
	player.play();
	player.pause();
	console.log('blank is running');
}

// Button and Switches
button.watch((err, value) => {
	if (err) {
		console.log(err);
	}

	if (!statusVideo && value === 1) {
		startVideo();
	}
	console.log('button: ' + value);
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
