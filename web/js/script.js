$(function() {

	// Settings
	const DEVICE_ID = 0;
	const RPI = false;
	const PATH_CTRL_0_VOICEOVER = "video/ctrl-0-voiceover.mov";
	const PATH_CTRL_0_NO_VOICEOVER = "video/ctrl-0-no_voiceover.mov";
	const PATH_CTRL_1 = "video/ctrl-1.mov";
	

	// Application
	var statusSwitch = false;
	if (DEVICE_ID === 0) {
		var statusVoiceover = false;
	}
	var statusVideo = false;
	var $overlay = $('#overlay');
	var ctrlVideo = document.getElementById('ctrl');

	if (DEVICE_ID === 0) {
		ctrlVideo.src = PATH_CTRL_0_VOICEOVER;
		ctrlVideo.load();
	} else if (DEVICE_ID === 1) {
		ctrlVideo.src = PATH_CTRL_1;
		ctrlVideo.load();
	} else {
		alert('WRONG DEVICE_ID! CAN ONLY BE 0 OR 1.');
	}

	if (RPI) {
		var socket = io();

		socket.on('switch', function(msg) {
			statusSwitch = msg === 'true';
			console.log('status switch is ' + statusSwitch);
		});

		if (DEVICE_ID === 0) {
			socket.on('voiceover', function(msg) {
				statusVoiceover = msg === 'true';
				console.log('voiceover is ' + statusVoiceover);
			});
		}

		socket.on('button', function() {
			runVideo();
		});

	} else {
		$(document).keypress(function(e) {
			switch(e.which) {
				case 113: // switch video on/off with the key "q"
				statusSwitch = !statusSwitch;
				console.log('status switch is ' + statusSwitch);
				break;

				case 119: // voiceover on/off with the key "w"
				if (DEVICE_ID === 0) {
					statusVoiceover = !statusVoiceover;
					console.log('voiceover is ' + statusVoiceover);
				}
				break;

				case 115: // start with the key "s"
				runVideo();
				break;
			}
		});
	}

	function runVideo() {
		if (!statusVideo) {
			statusVideo = true;

			// add the correct video if it's the device with the voiceover
			if (DEVICE_ID === 0) {
				if (statusVoiceover) {
					ctrlVideo.src = PATH_CTRL_0_VOICEOVER;
					ctrlVideo.load();
				} else {
					ctrlVideo.src = PATH_CTRL_0_NO_VOICEOVER;
					ctrlVideo.load();
				}
				console.log('video voiceover is ' + statusVoiceover);
			}
			
			// is the video being displayed or hidden?
			if (statusSwitch) {
				$overlay.hide();
				console.log('video is here');
			} else {
				console.log('video is blank');
			}

			ctrlVideo.play();
			console.log('video is playing');

			// reset everything for next play after the video has ended
			ctrlVideo.onended = function() {
				$overlay.show();
				this.pause();
				this.currentTime = 0;
				this.load();
				statusVideo = false;				
				console.log('video has ended. application is ready for next input');
			};
		}
	}
});