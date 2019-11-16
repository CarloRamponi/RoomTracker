import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgtableComponent } from './avgtable.component';

describe('AvgtableComponent', () => {
  let component: AvgtableComponent;
  let fixture: ComponentFixture<AvgtableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvgtableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
