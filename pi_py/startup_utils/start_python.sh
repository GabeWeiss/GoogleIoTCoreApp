#!/bin/sh

cd /home/pi/bpm_run/GoogleIoTCoreApp
git pull

cd pi_py/
source bin/activate

pip install -r requirements.txt

python bpm_writer.py > /home/pi/bpm.log 2>&1 &