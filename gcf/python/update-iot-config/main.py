import base64
import logging
import os

from google.oauth2 import service_account
from googleapiclient import discovery
from googleapiclient.errors import HttpError
from google.auth import compute_engine


def get_client(service_account_json):
    """Returns an authorized API client by discovering the IoT API and creating
    a service object using the service account credentials JSON."""
    api_scopes = ['https://www.googleapis.com/auth/cloud-platform']
    api_version = 'v1'
    discovery_api = 'https://cloudiot.googleapis.com/$discovery/rest'
    service_name = 'cloudiotcore'

    import pdb;pdb.set_trace()
    credentials = compute_engine.Credentials.from_service_account_file(
            service_account_json)
    scoped_credentials = credentials.with_scopes(api_scopes)

    discovery_url = '{}?version={}'.format(
            discovery_api, api_version)

    return discovery.build(
            service_name,
            api_version,
            discoveryServiceUrl=discovery_url,
            credentials=scoped_credentials)

def update_iot_config(request):
    request_json = request.get_json(force=True)
    logging.info(request_json)
    if not request_json:
        return 'We need more details!'

    new_config = request_json['newConfig']
    binary_data = base64.urlsafe_b64encode(
        new_config.encode('utf-8')).decode('ascii')
    device_id = request_json['deviceId']
    registry_id = 'iot_core_demo'
    registry_name = """projects/%s/locations/us-central1/registries/%s
    /devices/%s""" % (os.environ['GCP_PROJECT'], registry_id, device_id)
    request = {
      "name": registry_name,
      "versionToUpdate": '0',
      "binaryData": binary_data
    }

    client = get_client(request_json['serviceAccountKey'])
    return client.projects(
          ).locations().registries(
          ).devices().modifyCloudToDeviceConfig(
          name=registry_name, body=request).execute()