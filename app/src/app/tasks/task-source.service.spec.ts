import { TestBed, inject } from '@angular/core/testing';

import { TaskSourceService } from './task-source.service';

describe('TaskSourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskSourceService]
    });
  });

  it('should be created', inject([TaskSourceService], (service: TaskSourceService) => {
    expect(service).toBeTruthy();
  }));
});
