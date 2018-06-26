import { IotUsersModule } from './iot-users.module';

describe('IotUsersModule', () => {
  let iotUsersModule: IotUsersModule;

  beforeEach(() => {
    iotUsersModule = new IotUsersModule();
  });

  it('should create an instance', () => {
    expect(iotUsersModule).toBeTruthy();
  });
});
