import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutpageComponent } from './aboutpage.component';

describe('AboutpageComponent', () => {
  let component: AboutpageComponent;
  let fixture: ComponentFixture<AboutpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
