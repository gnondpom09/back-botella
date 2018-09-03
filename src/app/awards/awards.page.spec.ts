import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardsPage } from './awards.page';

describe('AwardsPage', () => {
  let component: AwardsPage;
  let fixture: ComponentFixture<AwardsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
