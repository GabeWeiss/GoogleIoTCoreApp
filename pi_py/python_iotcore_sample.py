#!/usr/bin/env python

# Copyright 2017 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Python sample for connecting to Google Cloud IoT Core via MQTT, using JWT.
This example connects to Google Cloud IoT Core via MQTT, using a JWT for device
authentication. After connecting, by default the device publishes 100 messages
to the device's MQTT topic at a rate of one per second, and then exits.
Before you run the sample, you must follow the instructions in the README
for this sample.
"""

# [START iot_mqtt_includes]
import argparse
import datetime
import os
import random
import ssl
import time

import jwt
import paho.mqtt.client as mqtt

import serial
# [END iot_mqtt_includes]

# The initial backoff time after a disconnection occurs, in seconds.
minimum_backoff_time = 1

# The maximum backoff time before giving up, in seconds.
MAXIMUM_BACKOFF_TIME = 32

# Whether to wait with exponential backoff before publishing.
should_backoff = False


# [START iot_mqtt_jwt]
def create_jwt(project_id, private_key_file, algorithm):

    token = {
            # The time that the token was issued at
            'iat': datetime.datetime.utcnow(),
            # The time the token expires.
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            # The audience field should always be set to the GCP project id.
            'aud': project_id
    }

    # Read the private key file.
    with open(private_key_file, 'r') as f:
        private_key = f.read()

    print('Creating JWT using {} from private key file {}'.format(
            algorithm, private_key_file))

    return jwt.encode(token, private_key, algorithm=algorithm)
# [END iot_mqtt_jwt]


# [START iot_mqtt_config]
def error_str(rc):
    """Convert a Paho error to a human readable string."""
    return '{}: {}'.format(rc, mqtt.error_string(rc))


def on_connect(unused_client, unused_userdata, unused_flags, rc):
    """Callback for when a device connects."""
    print('on_connect', mqtt.connack_string(rc))

    # After a successful connect, reset backoff time and stop backing off.
    global should_backoff
    global minimum_backoff_time
    global connected
    connected = True
    should_backoff = False
    minimum_backoff_time = 1



def on_disconnect(unused_client, unused_userdata, rc):
    """Paho callback for when a device disconnects."""
    print('on_disconnect', error_str(rc))

    # Since a disconnect occurred, the next loop iteration will wait with
    # exponential backoff.
    global should_backoff
    should_backoff = True


def on_publish(unused_client, unused_userdata, unused_mid):
    """Paho callback when a message is sent to the broker."""
    print('on_publish')


def on_message(unused_client, unused_userdata, message):
    """Callback when the device receives a message on a subscription."""
    global hr_limit
    payload = str(message.payload)
    print('Received message \'{}\' on topic \'{}\' with Qos {}'.format(
            payload, message.topic, str(message.qos)))
    hr_limit = int(payload)


def get_client(
        project_id, cloud_region, registry_id, device_id, private_key_file,
        algorithm, ca_certs, mqtt_bridge_hostname, mqtt_bridge_port):
    """Create our MQTT client. The client_id is a unique string that identifies
    this device. For Google Cloud IoT Core, it must be in the format below."""
    client = mqtt.Client(
            client_id=('projects/{}/locations/{}/registries/{}/devices/{}'
                       .format(
                               project_id,
                               cloud_region,
                               registry_id,
                               device_id)))

    # With Google Cloud IoT Core, the username field is ignored, and the
    # password field is used to transmit a JWT to authorize the device.
    client.username_pw_set(
            username='unused',
            password=create_jwt(
                    project_id, private_key_file, algorithm))

    # Enable SSL/TLS support.
    client.tls_set(ca_certs=ca_certs, tls_version=ssl.PROTOCOL_TLSv1_2)

    # Register message callbacks. 
    client.on_connect = on_connect
    #client.on_publish = on_publish
    client.on_disconnect = on_disconnect
    client.on_message = on_message

    # Connect to the Google MQTT bridge.
    client.connect(mqtt_bridge_hostname, mqtt_bridge_port)

    # Subscribe to the config topic.
    client.subscribe(mqtt_config_topic, qos=0)

    

    return client
# [END iot_mqtt_config]

project_id = 'calum-iot-demo'
cloud_region = 'us-central1'
registry_id = 'my-registry'
device_id = 'bpm_0'
private_key_file = 'device_keys/rsa_private.pem'
algorithm = 'RS256'
ca_certs = '/usr/local/etc/openssl/cert.pem'
mqtt_bridge_hostname = 'mqtt.googleapis.com'
mqtt_bridge_port = 8883

# This is the topic that the device will receive configuration updates on.
mqtt_config_topic = '/devices/{}/config'.format(device_id)


#uart config and vars
ser = serial.Serial()
ser.baudrate = 115200
ser.port = '/dev/cu.usbmodem1431'
ser.open()




# [START iot_mqtt_run]
def main():
    global minimum_backoff_time
    global connected
    connected = False
    global hr_limit

    #args = parse_command_line_args()

    mqtt_topic = '/devices/{}/events'.format(device_id)

    jwt_iat = datetime.datetime.utcnow()
    jwt_exp_mins = 120
    client = get_client(
        project_id, cloud_region, registry_id, device_id,
        private_key_file, algorithm, ca_certs,
        mqtt_bridge_hostname, mqtt_bridge_port)

    # Process network events on new thread
    client.loop_start()

    while True:

#backoff and refresh - can likely remove for simplicity - should implement our own version of loop to do this on seperate thread as well - WONT FIX
        # Wait if backoff is required.
        # if should_backoff:
        #     # If backoff time is too large, give up.
        #     if minimum_backoff_time > MAXIMUM_BACKOFF_TIME:
        #         print('Exceeded maximum backoff time. Giving up.')
        #         break

        #     # Otherwise, wait and connect again.
        #     delay = minimum_backoff_time + random.randint(0, 1000) / 1000.0
        #     print('Waiting for {} before reconnecting.'.format(delay))
        #     time.sleep(delay)
        #     minimum_backoff_time *= 2
        #     client.connect(mqtt_bridge_hostname, mqtt_bridge_port)
        # # [START iot_mqtt_jwt_refresh]
        # seconds_since_issue = (datetime.datetime.utcnow() - jwt_iat).seconds
        # if seconds_since_issue > 60 * jwt_exp_mins:
        #     print('Refreshing token after {}s').format(seconds_since_issue)
        #     jwt_iat = datetime.datetime.utcnow()
        #     client = get_client(
        #         project_id, cloud_region, registry_id, device_id,
        #         private_key_file, algorithm, ca_certs,
        #         mqtt_bridge_hostname, mqtt_bridge_port)
        # [END iot_mqtt_jwt_refresh]
# could remove above - see comment


        #payload = random.randint(50,100)

        ser.reset_input_buffer()
        time.sleep(0.1)
        sline = ser.readline() 
        if sline and sline != '':
            bpm = int(sline)
            print 'bpm: ' + str(bpm)
            payload = bpm

        if bpm >= hr_limit:
            print 'your too busy! take a breath'

        # Publish "payload" to the MQTT topic. qos=1 means at least once
        # delivery. Cloud IoT Core also supports qos=0 for at most once
        # delivery.
        if connected:
            print 'publishing ' + str(payload) + ' on ' + mqtt_topic 
            client.publish(mqtt_topic, payload, qos=0)


        # Send events every second. limit to 1 per second due to fs limits
        time.sleep(1)

# [END iot_mqtt_run]


if __name__ == '__main__':
    main()