# Smart LED Strips #

Who needs fancy, over priced, closed source lighting, when you can get some neopixels and wire something up yourself with a rpi? This library helps you do just that. It communicates with a connected arduino that controls your LEDs. I need to write up more documentation for this at some point, but as time permits. In the meantime, here's some basics to get you started:

	git clone https://github.com/jarethmt/Smart-LED-Strips.git
	yarn install
	sudo node .

For the wiring and hardware setup, this script uses the "node-pixel" library. They have detailed setup / wiring docs, and I recommend you follow them. After eveyrthing is wired up per their recommendations and you flash the required code on the Arduino, you should be able to load this on the rpi and start it with the above code. You can optionally persist it at boot by using pm2 as so:

	npm install -g pm2
	pm2 start /path/to/index.js
	pm2 startup
	pm2 save

Be aware, this library seems to overload my pi zero, I need to figure out why. Very much an alpha stage thing. Pull requests welcome!
