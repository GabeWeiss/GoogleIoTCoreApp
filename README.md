# GoogleIoTCoreApp

This code represents what my team wrote while on stage at Google Cloud Next 2018's session "Building IoT Applications on Google Cloud". If you want to see the presentation live, the YouTube video is here: https://www.youtube.com/watch?v=RYaprBSDy8A.

Each piece of the app is contained in its own folder. Device code for running on the Raspberry Pi devices that were built, Google Cloud Functions to pull the data from Cloud Pub/Sub and move them into Cloud Firestore. An Angular front-end application to read the data in real time from Firestore and display graphs of our telemetry data. And finally a Google Sheets implementation with Apps Script to do time series data visualization, as well as administration tabs to send a configuration message down to our devices via a 2nd Cloud Function.
