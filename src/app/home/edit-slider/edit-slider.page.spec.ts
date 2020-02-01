import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSliderPage } from './edit-slider.page';

describe('EditSliderPage', () => {
  let component: EditSliderPage;
  let fixture: ComponentFixture<EditSliderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSliderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSliderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
