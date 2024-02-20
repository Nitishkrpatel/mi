import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiwProductByDateComponent } from './veiw-product-by-date.component';

describe('VeiwProductByDateComponent', () => {
  let component: VeiwProductByDateComponent;
  let fixture: ComponentFixture<VeiwProductByDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VeiwProductByDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VeiwProductByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
