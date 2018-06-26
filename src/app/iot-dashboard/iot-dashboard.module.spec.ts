import { IotDashboardModule } from './iot-dashboard.module';

describe('IotDashboardModule', () => {
  let iotDashboardModule: IotDashboardModule;

  beforeEach(() => {
    iotDashboardModule = new IotDashboardModule();
  });

  it('should create an instance', () => {
    expect(iotDashboardModule).toBeTruthy();
  });
});
