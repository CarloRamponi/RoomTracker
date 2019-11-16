import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeplanimetryComponent } from './realtimeplanimetry.component';

describe('RealtimeplanimetryComponent', () => {
  let component: RealtimeplanimetryComponent;
  let fixture: ComponentFixture<RealtimeplanimetryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealtimeplanimetryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtimeplanimetryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
