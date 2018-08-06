# Device Hardware and Firmware
This will repository will help you reproduce the hardware, firmware, and software used to create the device shown in the presentation.

## Hardware
[TODO: Parts list]
[TODO: Ftizing Diagram]

## Firmware
You can find the Arduino code for the device in the `arduino/BPM_to_Serial` folder

1. First follow the instructions from [PulseSensor.com](https://pulsesensor.com/pages/installing-our-playground-for-pulsesensor-arduino) to install their Arduino library
2. Install the 1 wire library by searching for and installing 'Wire' from Sketch > Include Library > Manage Libraries
2. Put the `BPM_to_Serial` fodler in your sketchbook and open it in the Arduino IDE
3. Select your USB port, Board "Arduino Pro Mini", and Processor "ATmega328P (3.3v, 8MHz)" (or whatever board you have with 3.3v logic levels).
4. Upload to the Pro Mini with your FTDI cable
5. You can test things out by looking for the comma sperated values in the serial monitor

## Software
This repo provides software software to run on and setup the Pi.

1. Clone this repo to a folder called `bpm_run` in the home folder of your pi, so that you have `/home/pi/bpm_run/GoogleIoTCoreApp'
2. 
