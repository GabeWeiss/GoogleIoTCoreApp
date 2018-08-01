const admin = require('firebase-admin');
admin.initializeApp();
var db = admin.firestore();

/**
 * Background Cloud Function to be triggered by Pub/Sub.
 * This function gets executed when telemetry data gets
 * send to IoT Core and consequently a Pub/Sub message
 * gets published to the selected topic.
 *
 * @param {Object} event The Cloud Functions event.
 * @param {Function} callback The callback function.
 */
exports.telemetryToFirestore = (event, callback) => {
  const pubsubMessage = event.data;

  if (!pubsubMessage.data) {
    throw new Error('No telemetry data was provided!');
  }
  const payload = Buffer.from(pubsubMessage.data, 'base64').toString();
  const telemetry = JSON.parse(payload);
  const attributes = pubsubMessage.attributes;
  const deviceId = attributes.deviceId;

  db.collection(`devices/${deviceId}/measurements`).add({
    'timestamp': telemetry.timestamp,
    'temperature': telemetry.temperature,
    'bpm': telemetry.bpm
  }).then((writeResult) => {
    console.log({'result': 'Message with ID: ' + writeResult.id + ' added.'});
    return;
  }).catch((err) => {
    console.log(err);
    return;
  });

  callback();
};