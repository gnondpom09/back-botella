import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaintingPage } from './add-painting.page';

describe('AddPaintingPage', () => {
  let component: AddPaintingPage;
  let fixture: ComponentFixture<AddPaintingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPaintingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaintingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
