#	Copyright 2015, Google, Inc. 
# Licensed under the Apache License, Version 2.0 (the "License"); 
# you may not use this file except in compliance with the License. 
# You may obtain a copy of the License at 
#  
#    http://www.apache.org/licenses/LICENSE-2.0 
#  
# Unless required by applicable law or agreed to in writing, software 
# distributed under the License is distributed on an "AS IS" BASIS, 
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
# See the License for the specific language governing permissions and 
# limitations under the License.
#
/**
* Updates 'Individual Device - Info' sheet with all available information for a specific device.
* Specific device ID is chosen at the top of the 'Device Info' sheet by the user.
*/

function retrieveAllForDevice() {
  // Find 'Individual Device - Info' sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var deviceInfoSheet = ss.getSheetByName('Individual Device - Info');
  // Set info ranges
  var firstNameRange = deviceInfoSheet.getRange("B5");
  var lastNameRange = deviceInfoSheet.getRange("B6");
  var displayNameRange = deviceInfoSheet.getRange("B7");
  var thresholdRange = deviceInfoSheet.getRange("B8");
  var lastRow = Math.max(deviceInfoSheet.getLastRow(),37);
  var measurementsRange = deviceInfoSheet.getRange("A37:C"+lastRow);
  // Clear measurements and conditional formatting
  measurementsRange.clearContent();
  deviceInfoSheet.clearConditionalFormatRules();
  // Set variable requested device
  var requestedDevice = deviceInfoSheet.getRange("B1").getValue();
  // For requested device, set First Name, Last Name, & Display Name
  var deviceDetails = firestore.getDocument('devices/' + requestedDevice);
  firstNameRange.setValue(deviceDetails.fields.firstName);
  lastNameRange.setValue(deviceDetails.fields.lastName);
  displayNameRange.setValue(deviceDetails.fields.displayName);
  // Get current threshold and set value
  var configSheet = ss.getSheetByName('All Devices - Configure');
  var currentThreshold = configSheet.getRange("B3").getValue();
  thresholdRange.setValue(currentThreshold);
  // For requested device, get list of all measurements
  var deviceMeasurements = firestore.query('devices/' + requestedDevice + '/measurements').orderBy("timestamp", "desc").limit(60).execute();
  // Update "Time Period Represented" stats
  var numMeasurements = deviceMeasurements.length
  deviceInfoSheet.getRange("C29").setValue(numMeasurements);
  var stopTime = new Date(getDateFromIso(deviceMeasurements[0].updateTime));
  deviceInfoSheet.getRange("B29").setValue(stopTime);
  var startTime = new Date(getDateFromIso(deviceMeasurements[numMeasurements-1].updateTime));
  deviceInfoSheet.getRange("A29").setValue(startTime);
  // Parse list of measurements into new rows
  deviceMeasurements.forEach(function(measurement) {
    var formattedDate = new Date(getDateFromIso(measurement.updateTime));
    var newRow = [formattedDate, measurement.fields.bpm, measurement.fields.temperature];
    deviceInfoSheet.appendRow(newRow);
  });
  // Add conditional formatting to turn BPM values (B37:B) red if over threshold
  var formatRange = deviceInfoSheet.getRange("B37:B");
  var rule = SpreadsheetApp.newConditionalFormatRule()
  .whenNumberGreaterThan(currentThreshold)
  .setBackground("#FF0000")
  .setRanges([formatRange])
  .build();
  var rules = deviceInfoSheet.getConditionalFormatRules();
  rules.push(rule);
  deviceInfoSheet.setConditionalFormatRules(rules);
};
