import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAwardPage } from './add-award.page';

describe('AddAwardPage', () => {
  let component: AddAwardPage;
  let fixture: ComponentFixture<AddAwardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAwardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAwardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
