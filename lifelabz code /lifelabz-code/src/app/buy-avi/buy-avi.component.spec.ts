import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyAviComponent } from './buy-avi.component';

describe('BuyAviComponent', () => {
  let component: BuyAviComponent;
  let fixture: ComponentFixture<BuyAviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyAviComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyAviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
