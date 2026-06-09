import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterSaveDialogComponent } from './after-save-dialog.component';

describe('AfterSaveDialogComponent', () => {
  let component: AfterSaveDialogComponent;
  let fixture: ComponentFixture<AfterSaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfterSaveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterSaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
