import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryCodeSelectionPage } from './country-code-selection.page';

describe('CountryCodeSelectionPage', () => {
  let component: CountryCodeSelectionPage;
  let fixture: ComponentFixture<CountryCodeSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryCodeSelectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryCodeSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
