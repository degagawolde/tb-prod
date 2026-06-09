import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisitComponent } from './revisit.component';

describe('RevisitComponent', () => {
  let component: RevisitComponent;
  let fixture: ComponentFixture<RevisitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisitComponent]
    });
    fixture = TestBed.createComponent(RevisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
