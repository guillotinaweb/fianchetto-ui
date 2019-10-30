import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxChessboardComponent } from './ngx-chessboard.component';

describe('NgxChessboardComponent', () => {
  let component: NgxChessboardComponent;
  let fixture: ComponentFixture<NgxChessboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxChessboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxChessboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
