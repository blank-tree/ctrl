# CTRL

Interactive video installation around the cybernetics hypothesis.

## Setup
### Hardware
To run this project, you need the following:
- 2x Raspberry Pi
- 2x projector (or display)
- stereo speaker set
- the control unit

### Software
#### Raspbian, Node.js, npm and Vim

Install [Raspbian Strech with desktop](https://www.raspberrypi.org/downloads/raspbian/) on the sd card (on Mac with [Etcher](https://www.balena.io/etcher/)). Afterwards you need to install node, npm and vim

```
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_11.x | bash -
sudo apt-get install -y nodejs
```

Check the versions

```
$ node -v
v11.10.0

$ npm -v
6.9.0
```

Install Vim for immideate changes you need to make

```
sudo apt-get update
sudo apt-get install vim -y
```

#### Repository
Afterwards, clone this repository

```
git clone git@github.com:blank-tree/ctrl.git
cd ctrl
npm install
```

#### Application configuration

Now edit the `config.js` file with the correct pins (`PIN_BUTTON` and `PIN_SWITCH`)for the button and the switch, and the device number (`DEVICE_NO`) with

```
vim config.js
```

Start the application

```
node app.js
```

Check in Chromium if you reach the site `localhost:3000`. If that works, start using the daemon to start the node application on start:

#### Autostart Node.js application

Quit the running application first with `ctrl+c`.

```
sudo npm install -g pm2
pm2 start app.js
```

If the application crashes, PM2 will restart it.

The pm2 startup command will generate a script that will lunch PM2 on boot together with the applications that you configure to start.

```
pm2 startup systemd
```
will generate something like

```
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /h
```

Copy the generated command and run it.

```
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/p
```

This created a system unit that will start PM2 on boot. When the system will boot PM2 will resurrect from a dump file that is not created yet. To create it run

```
pm2 save
```

This will save the current state of PM2 (with app.js running) in a dump file that will be used when resurrecting PM2.

You will be able to check anytime the status of your application with `pm2 list`, `pm2 status` or `pm2 show`.

#### Autostart Chromium

To start chromium with the website on startup, edit this file

```
sudo vim /home/pi/.config/lxsession/LXDE-pi/autostart
```

And add this

```
# this is a comment
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --kiosk http://localhost:3000  # load chromium after boot and open the website in full screen mode
```

To quit chromium with an attached keyboard, open the menu with the windows key, navigate to the terminal and use

```
sudo killall chromium-browser
```

## License
All rights reserved. 2019 – Fernando Obieta