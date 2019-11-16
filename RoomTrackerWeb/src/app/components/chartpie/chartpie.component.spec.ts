import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartpieComponent } from './chartpie.component';

describe('ChartpieComponent', () => {
  let component: ChartpieComponent;
  let fixture: ComponentFixture<ChartpieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartpieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartpieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
