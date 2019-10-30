import { TestBed } from '@angular/core/testing';

import { NgxChessboardService } from './ngx-chessboard.service';

describe('NgxChessboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxChessboardService = TestBed.get(NgxChessboardService);
    expect(service).toBeTruthy();
  });
});
