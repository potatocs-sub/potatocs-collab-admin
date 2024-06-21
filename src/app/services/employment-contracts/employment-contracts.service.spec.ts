import { TestBed } from '@angular/core/testing';

import { EmploymentContractService } from './employment-contracts.service';

describe('EmploymentContractService', () => {
  let service: EmploymentContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmploymentContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
