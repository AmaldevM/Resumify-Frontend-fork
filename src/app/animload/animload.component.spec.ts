import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimLoadingComponent } from './animload.component';

describe('AnimloadComponent', () => {
  let component: AnimLoadingComponent;
  let fixture: ComponentFixture<AnimLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
