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
* Updates 'Current Device Info' block in 'Individual Device - Configure' sheet when device ID dropdown in C1 is changed 
*/
function onEdit(e) {
    if (e.range.getA1Notation() !== 'C1') return;
    // Find 'Individual Device - Configure' sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var indConfigSheet = ss.getSheetByName('Individual Device - Configure');  
    // Clear info pasting ranges
    var firstNameRange = indConfigSheet.getRange("C5");
    var lastNameRange = indConfigSheet.getRange("C6");
    var displayNameRange = indConfigSheet.getRange("C7");
    // Set variable requested device
    var requestedDevice = indConfigSheet.getRange("C1").getValue();
    // For requested device, set First Name, Last Name and Display Name
    var deviceDetails = firestore.getDocument('devices/' + requestedDevice);
    firstNameRange.setValue(deviceDetails.fields.firstName);
    lastNameRange.setValue(deviceDetails.fields.lastName);
    displayNameRange.setValue(deviceDetails.fields.displayName);
};

/**
* Processes updates to device field as requested in 'Individual Device - Configure' sheet.
* End user picks a device, this triggers current fields to render (from onEdit function), then user picks field to update,
* and provides new value. Upon hitting "Go", which triggers this function, the new value is written back into Firestore.
*/

function updateDeviceInfo() {
    // Find 'Individual Device - Configure' sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var indConfigSheet = ss.getSheetByName('Individual Device - Configure');
    // Set variable requested device
    var requestedDevice = indConfigSheet.getRange("C1").getValue();
    // For requested device, set First Name, Last Name and Display Name ranges
    var firstNameRange = indConfigSheet.getRange("C5");
    var lastNameRange = indConfigSheet.getRange("C6");
    var displayNameRange = indConfigSheet.getRange("C7");
    // Make field update
    var requestedField = indConfigSheet.getRange("B12").getValue();
    var newValue = indConfigSheet.getRange("C12").getValue();
    var docFields = firestore.getDocument('devices/' + requestedDevice).fields
    if (requestedField == "First Name") {
      docFields["firstName"] = newValue;
      firestore.updateDocument('devices/' + requestedDevice, docFields);
      // Query and paste the updated device details
      var deviceDetails = firestore.getDocument('devices/' + requestedDevice);
      firstNameRange.setValue(deviceDetails.fields.firstName);
      indConfigSheet.getRange("B12:C12").clearContent();
      };
    if (requestedField == "Last Name") {
      docFields["lastName"] = newValue;
      firestore.updateDocument('devices/' + requestedDevice, docFields);
      // Query and paste the updated device details
      var deviceDetails = firestore.getDocument('devices/' + requestedDevice);
      lastNameRange.setValue(deviceDetails.fields.lastName);
      indConfigSheet.getRange("B12:C12").clearContent();
      };
    if (requestedField == "Display Name") {
      docFields["displayName"] = newValue;
      firestore.updateDocument('devices/' + requestedDevice, docFields);
      // Query and paste the updated device details
      var deviceDetails = firestore.getDocument('devices/' + requestedDevice);
      displayNameRange.setValue(deviceDetails.fields.displayName);
      indConfigSheet.getRange("B12:C12").clearContent();
      };
};
