import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnSectionComponent } from './add-on-section.component';

describe('AddOnSectionComponent', () => {
  let component: AddOnSectionComponent;
  let fixture: ComponentFixture<AddOnSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOnSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOnSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
