import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartviewComponent } from './chartview.component';

describe('ChartviewComponent', () => {
  let component: ChartviewComponent;
  let fixture: ComponentFixture<ChartviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
