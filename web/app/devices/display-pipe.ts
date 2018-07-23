import {Pipe} from '@angular/core';
import {Device} from './device'
@Pipe({
  name: 'displayName'
})
export class DisplayPipe {
  transform(device: Device) {
    if (device.displayName) {
      return device.displayName;
    } else if (device.firstName) {
      return `${device.firstName}'s Device`;
    } else if (device.deviceId) {
      return '';
    }

  }
}
