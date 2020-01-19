import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaintingPage } from './edit-painting.page';

describe('EditPaintingPage', () => {
  let component: EditPaintingPage;
  let fixture: ComponentFixture<EditPaintingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPaintingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaintingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
