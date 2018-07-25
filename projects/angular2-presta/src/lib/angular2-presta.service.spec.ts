import { TestBed, inject } from '@angular/core/testing';

import { Angular2PrestaService } from './angular2-presta.service';

describe('Angular2PrestaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Angular2PrestaService]
    });
  });

  it('should be created', inject([Angular2PrestaService], (service: Angular2PrestaService) => {
    expect(service).toBeTruthy();
  }));
});
