import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageShipsComponent } from './manage-ships.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

describe('ManageShipsComponent', () => {
  let component: ManageShipsComponent;
  let fixture: ComponentFixture<ManageShipsComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule, NgxPaginationModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
          {provide: Router, useValue: router}],
      declarations: [ ManageShipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageShipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.manageShips = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on init method Manage ships should be displayed for navy', () => {
    component.Adminservice.changedtoManageShips('true');
    component.theme = 'navy';
  });


  it('on init method Manage ships should be displayed for grey', () => {
    component.Adminservice.changedtoManageShips('true');
    component.theme = 'grey';
  });


  it('on init method Manage ships should not be displayed for navy', () => {
    component.Adminservice.changedtoManageShips('false');
    component.theme = 'navy';
  });


  it('on init method Manage ships should not be displayed for grey', () => {
    component.Adminservice.changedtoManageShips('false');
    component.theme = 'grey';
  });

  it('onclick should clear Search', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.clearSearch'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should sort table', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.dashboard-table'));
    buttonElement.triggerEventHandler('matSortChange', null);
  });

});
