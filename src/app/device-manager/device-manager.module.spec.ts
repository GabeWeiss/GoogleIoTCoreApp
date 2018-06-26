import { DeviceManagerModule } from './device-manager.module';

describe('DeviceManagerModule', () => {
  let deviceManagerModule: DeviceManagerModule;

  beforeEach(() => {
    deviceManagerModule = new DeviceManagerModule();
  });

  it('should create an instance', () => {
    expect(deviceManagerModule).toBeTruthy();
  });
});
