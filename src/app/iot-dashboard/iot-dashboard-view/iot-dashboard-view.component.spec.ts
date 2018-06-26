import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IotDashboardViewComponent } from './iot-dashboard-view.component';

describe('IotDashboardViewComponent', () => {
  let component: IotDashboardViewComponent;
  let fixture: ComponentFixture<IotDashboardViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IotDashboardViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotDashboardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
