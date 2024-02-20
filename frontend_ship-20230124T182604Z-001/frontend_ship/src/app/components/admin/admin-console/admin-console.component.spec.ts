import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminConsoleComponent } from './admin-console.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

describe('AdminConsoleComponent', () => {
  let component: AdminConsoleComponent;
  let fixture: ComponentFixture<AdminConsoleComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
          {provide: Router, useValue: router}],
      declarations: [ AdminConsoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on init method set role as admin', () => {
    component.role = 'Admin';
  });

  it('onclick should change feature ', () => {
    component.loginStatus = 'true';
    component.isAdmin = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.changeConsole'));
    buttonElement.triggerEventHandler('click', null);
  });

});
