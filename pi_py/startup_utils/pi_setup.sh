#basic dirs
sudo apt-get --assume-yes install git

mkdir /home/pi/bpm_run
mkdir /home/pi/bpm_run/device

cd /home/pi/bpm_run

#copy the deploy key private key over

git clone https://github.com/GabeWeiss/GoogleIoTCoreApp.git

cd /home/pi/bpm_run/GoogleIoTCoreApp/pi_py

sudo chmod +x startup_utils/start_python.sh


#device setup
cd /home/pi/bpm_run/GoogleIoTCoreApp/pi_py

cp startup_utils/device_config_TEMPLATE.json /home/pi/bpm_run/device/device_config.json

cd /home/pi/bpm_run/device
openssl genrsa -out rsa_private.pem 2048
openssl rsa -in rsa_private.pem -pubout -out rsa_public.pem
cat rsa_public.pem


#util script
cd /home/pi/bpm_run/GoogleIoTCoreApp/pi_py
sudo cp startup_utils/bpm.service /lib/systemd/system/bpm.service
sudo chmod 644 /lib/systemd/system/bpm.service

sudo systemctl daemon-reload
sudo systemctl enable bpm.service

#remember to reboot
#sudo reboot
