const {google} = require('googleapis');

/**
 *  Sets the required  API client by discovering the Cloud IoT Core API with
 *  the provided API key.
 * @param {Object} serviceAccount A service account JSON object.
 */
function setAuth(serviceAccount) {
  const jwtAccess = new google.auth.JWT();
  jwtAccess.fromJSON(serviceAccount);
  // Note that if you require additional scopes, they should be specified as a
  // string, separated by spaces.
  jwtAccess.scopes = 'https://www.googleapis.com/auth/cloud-platform';
  // Set the default authentication to the above JWT access.
  google.options({ auth: jwtAccess });
}

/**
 * Responds to a HTTP request and updates the desired
 * IoT device config.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.updateIoTConfig = (req, res) => {
  let body = req.body;
  if (!body) {
    res.status(400).send('We need more details!');
  }

  const bodyToString = body.newConfig;
  const binaryData = Buffer.from(bodyToString).toString('base64');
  const deviceId = body.deviceId;
  const registryId = 'nerves';
  const registryName = `projects/${process.env.GCP_PROJECT}/locations/us-central1/registries/${registryId}/devices/${deviceId}`;
  const request = {
    name: registryName,
    versionToUpdate: '0',
    binaryData: binaryData
  };

  setAuth(body.serviceAccountKey);
  var client = google.cloudiot('v1');
  client.projects.locations.registries.devices.modifyCloudToDeviceConfig(request,
    (err, data) => {
      if (err) {
        console.log('Message: ', err);
        console.log('Could not update config:', deviceId);
      } else {
        console.log('Success :', data);
      }
    }
  );

  res.status(200).end();
};