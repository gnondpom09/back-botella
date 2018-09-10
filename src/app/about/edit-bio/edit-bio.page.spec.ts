import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBioPage } from './edit-bio.page';

describe('EditBioPage', () => {
  let component: EditBioPage;
  let fixture: ComponentFixture<EditBioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
