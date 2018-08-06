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
* Configures BPM Threshold on all devices using updateIotConfig function
*/

function configureAllDevices() {
  // Find 'All Devices - Configure' sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var allConfigSheet = ss.getSheetByName('All Devices - Configure');
  // Set current and new values for BPM threshold
  var currentValueRange = allConfigSheet.getRange("B3");
  var currentValue = currentValueRange.getValue();
  var newValueRange = allConfigSheet.getRange("C3");
  var newValue = newValueRange.getValue();
  var newValueString = newValue.toString();
  // Check if new value equal to current, or NULL, or < 0
  if (newValue == currentValue || newValue < 0 || newValueRange.isBlank()) {
    SpreadsheetApp.getUi().alert('Configuration not processed because new value is either blank or equal to the current value.');
  } else {
    // Get list of all device IDs
    var allIds = firestore.getDocumentIds("devices")
    // Run updateIoTConfig for each device ID 
    allIds.forEach(function(deviceId) {
      updateIoTConfig(deviceId, newValueString);
    });
    // Update current value range and clear out new value range
    currentValueRange.setValue(newValue);
    newValueRange.clearContent();
    // Provide pop-up that tells user configuration is complete
    SpreadsheetApp.getUi().alert('Configuration is complete.');
  };
};


/**
* Updates BPM Threshold on given IoT device
*/
function updateIoTConfig(deviceId, newConfig) {
  var formData = {
    "newConfig": newConfig,
    "deviceId": deviceId,
    "serviceAccountKey": serviceAccountKey
  };
  
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'muteHttpExceptions': true,
    'payload' : JSON.stringify(formData)
  };
  UrlFetchApp.fetch('INSERT_CLOUD_FUNCTION_URL', options);
};
