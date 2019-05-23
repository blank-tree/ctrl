$(function() {

	// Settings
	const DEVICE_ID = 0;
	const RPI = false;
	// const VIDEO_RUNTIME = 307000; // 5'07'' in ms
	

	// Application
	var statusSwitch = false;
	if (DEVICE_ID === 0) {
		var statusVoiceover = false;
	}
	var statusButton = false;
	var statusVideo = false;
	var $overlay = $('#overlay');
	var $mainWrapper = $('#main-wrapper');
	var ctrlVideo = document.getElementById('ctrl');

	if (DEVICE_ID === 0) {
		// ctrlVideo.src = "video/ctrl-0-voiceover.mov";
		$('video').append('<source src="video/ctrl-0-voiceover.mov" type="video/mp4">');
	} else if (DEVICE_ID === 1) {
		// ctrlVideo.src = "video/ctrl-1.mov";
		$('video').append('<source src="video/ctrl1.mov" type="video/mp4">');
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

		socket.on('button', function(msg) {
			statusButton = msg === 'true';
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
				$('video source').remove();
				if (statusVoiceover) {
					$('video').append('<source src="video/ctrl-0-voiceover.mov" type="video/mp4">');
				} else {
					$('video').append('<source src="video/ctrl-0-no_voiceover.mov" type="video/mp4">');
				}
				console.log('video voiceover is ' + statusVoiceover);
			}
			
			// is the video being displayed or hidden?
			if (statusSwitch) {
				$overlay.hide();
			}

			var myVideo = document.getElementById("ctrl");
			myVideo.play();
			console.log('video is playing');

			// reset everything for next play after the video has ended
			myVideo.onended = function() {
				this.pause();
				this.currentTime = 0;
				statusVideo = false;
				$overlay.show();
				console.log('video has ended. application is ready for next input');
			}

			// // reset everything for next play after the video has ended
			// setTimeout(function() {
			// 	var myVideo = document.getElementById("ctrl");
			// 	myVideo.currentTime = 0;
			// 	statusVideo = false;
			// 	$overlay.show();
			// 	console.log('video has ended. application is ready for next input');

			// }, VIDEO_RUNTIME);
		}
	}
});