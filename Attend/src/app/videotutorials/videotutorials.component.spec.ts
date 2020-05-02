import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideotutorialsComponent } from './videotutorials.component';

describe('VideotutorialsComponent', () => {
  let component: VideotutorialsComponent;
  let fixture: ComponentFixture<VideotutorialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideotutorialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideotutorialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
