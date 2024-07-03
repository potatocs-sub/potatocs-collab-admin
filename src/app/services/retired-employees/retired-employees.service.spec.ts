import { TestBed } from '@angular/core/testing';

import { RetiredEmployeesService } from './retired-employees.service';

describe('RetiredEmployeesService', () => {
  let service: RetiredEmployeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetiredEmployeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
