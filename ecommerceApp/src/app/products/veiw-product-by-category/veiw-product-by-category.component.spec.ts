import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiwProductByCategoryComponent } from './veiw-product-by-category.component';

describe('VeiwProductByCategoryComponent', () => {
  let component: VeiwProductByCategoryComponent;
  let fixture: ComponentFixture<VeiwProductByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VeiwProductByCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VeiwProductByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
