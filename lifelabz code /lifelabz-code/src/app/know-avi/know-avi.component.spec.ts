import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowAviComponent } from './know-avi.component';

describe('KnowAviComponent', () => {
  let component: KnowAviComponent;
  let fixture: ComponentFixture<KnowAviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowAviComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowAviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
