# IoTCoreApp Serverless Backend

The app uses a serveless infrastructure for the backend powered by [Google Cloud Functions](https://cloud.google.com/functions/) with 2 microservices:

  - [telemetryToFirestore](https://github.com/GabeWeiss/GoogleIoTCoreApp/tree/master/gcf/telemetryToFirestore)
  - [updateIoTConfig](https://github.com/GabeWeiss/GoogleIoTCoreApp/tree/master/gcf/updateIoTConfig)

### Telemetry to Firestore
This function subscribes to the [Pub/Sub](https://cloud.google.com/pubsub/) topic that we configured the IoT devices to send telemetry to, so that every time data is sent to IoT Core a new instance of this function gets executed. The function parses the message from the Pub/Sub event and writes it to [Cloud Firestore](https://firebase.google.com/docs/firestore/).

### Update IoT Config

This other function is triggered by an HTTP/S call, so that the Frontend can easily modify the different IoT Devices configuration. To accomplish that we are using the [Cloud IoT Core REST API](https://cloud.google.com/iot/docs/reference/rest/), specifically the [modifyCloudToDeviceConfig](https://cloud.google.com/iot/docs/reference/cloudiot/rest/v1/projects.locations.registries.devices/modifyCloudToDeviceConfig) method.