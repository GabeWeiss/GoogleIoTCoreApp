#!/bin/sh

cd /home/pi/bpm_run/GoogleIoTCoreApp
git pull

cd pi_py/
source bin/activate

pip install -r requirements.txt

if [ $FAKE = true ] ; then
	python bpm_fake.py > /home/pi/bpm_fake.log 2>&1 &
fi
	python bpm_writer.py > /home/pi/bpm.log 2>&1 &	