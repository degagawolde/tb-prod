import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskResultDialogComponent } from './risk-result-dialog.component';

describe('RiskResultDialogComponent', () => {
  let component: RiskResultDialogComponent;
  let fixture: ComponentFixture<RiskResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskResultDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
