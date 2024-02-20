import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiwAllProductComponent } from './veiw-all-product.component';

describe('VeiwAllProductComponent', () => {
  let component: VeiwAllProductComponent;
  let fixture: ComponentFixture<VeiwAllProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VeiwAllProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VeiwAllProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
