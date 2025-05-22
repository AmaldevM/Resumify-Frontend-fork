import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimloadComponent } from './animload.component';

describe('AnimloadComponent', () => {
  let component: AnimloadComponent;
  let fixture: ComponentFixture<AnimloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
