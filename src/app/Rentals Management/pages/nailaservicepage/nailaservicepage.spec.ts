import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NailaservicePage } from './nailaservicePage';

describe('NailaservicePage', () => {
  let component: NailaservicePage;
  let fixture: ComponentFixture<NailaservicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NailaservicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NailaservicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
