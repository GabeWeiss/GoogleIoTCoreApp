# Google Sheets Frontend for "Building IoT Applications on Google Cloud"

This repo includes the the Apps Script code for building the Google Sheets Frontend demoed in the NEXT 2018 talk ["Building IoT Applications on Google Cloud"](https://www.youtube.com/watch?v=RYaprBSDy8A)

The frontend performs three functions:
1. Displays a timelice of device measurement data by reading from a Firestore database.
2. Updates device metadata by writing back to a Firestore database.
3. Updates device configuration in IoT Core by calling a Cloud Function.

# Setup Instructions

## Spreadsheet Setup
1. Create a Google Sheet modeled after this template: [Who's nervous?](https://docs.google.com/spreadsheets/d/1wM_yIHCsDxM092qMzPY7DySnhXB6ztOBH2iFQtirE8M/edit?usp=sharing)

## Apps Script Setup
1. From your response spreadsheet, access the Script Editor from the Tools menu.
2. Create five script files, [key.gs](https://github.com/GabeWeiss/GoogleIoTCoreApp/blob/master/gsuite/key.gs), [dateFromIso.gs](https://github.com/GabeWeiss/GoogleIoTCoreApp/blob/master/gsuite/dateFromIso.gs), [indInfo.gs](https://github.com/GabeWeiss/GoogleIoTCoreApp/blob/master/gsuite/indInfo.gs), [indConfig.gs](https://github.com/GabeWeiss/GoogleIoTCoreApp/blob/master/gsuite/indConfig.gs), and [allConfig.gs](https://github.com/GabeWeiss/GoogleIoTCoreApp/blob/master/gsuite/allConfig.gs).
3. Update `URLFetchApp.fetch` in allConfig.gs to your own Cloud Function URL.
4. Click Save.

## Import the [Firestore Google Apps Script Library](https://github.com/grahamearley/FirestoreGoogleAppsScript)
1. In the Script Editor, select the Resources menu item and choose Libraries.
2. In the "Add a library" input box, enter 1VUSl4b1r1eoNcRWotZM3e87ygkxvXltOgyDZhixqncz9lQ3MjfT1iKFw and click "Add." Choose the most recent version number.

## Service Account Setup
1. Follow [these instructions](https://github.com/grahamearley/FirestoreGoogleAppsScript#creating-a-service-account) to create a service account. For your service account's role, choose Cloud Datastore Owner and Cloud IoT Admin.
2. Copy the Service Account json data into [key.gs](https://github.com/GabeWeiss/GoogleIoTCoreApp/blob/master/gsuite/key.gs) to set `var serviceAccountKey`.

## Apps Script Trigger
1. From the Edit menu within the Script Editor, choose Current Project Triggers.
2. Choose to run "onEdit", "From spreadsheet", "On edit". Set notifications to immediately (for any debugging; you may change this later).


NOTE: This is not an official Google product.
