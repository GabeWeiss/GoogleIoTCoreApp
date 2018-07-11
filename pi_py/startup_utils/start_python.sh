#!/bin/sh

cd /home/pi/bpm_run/GoogleIoTCoreApp/pi_py/
git pull

pip install -r requirements.txt

python -u bpm_writer.py > /home/pi/bpm.log 2>&1 &