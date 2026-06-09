import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiabetesTestDialogComponent } from './diabetes-test-dialog.component';

describe('PredictionDialogComponent', () => {
  let component: DiabetesTestDialogComponent;
  let fixture: ComponentFixture<DiabetesTestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiabetesTestDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiabetesTestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
