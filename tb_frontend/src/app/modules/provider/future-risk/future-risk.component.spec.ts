import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureRiskComponent } from './future-risk.component';

describe('FutureRiskComponent', () => {
  let component: FutureRiskComponent;
  let fixture: ComponentFixture<FutureRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FutureRiskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FutureRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
