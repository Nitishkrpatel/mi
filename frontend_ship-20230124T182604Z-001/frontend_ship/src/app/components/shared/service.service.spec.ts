import { TestBed } from '@angular/core/testing';

import { ServiceService } from './service.service';
import {HttpClientModule} from '@angular/common/http';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('ServiceService', () => {
  let service: ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
          providers: [ServiceService]
    });
    service = TestBed.inject(ServiceService);
  });

  it('should be created', () => {
    const services: ServiceService = TestBed.inject(ServiceService);
    expect(services).toBeTruthy();
   });

});


