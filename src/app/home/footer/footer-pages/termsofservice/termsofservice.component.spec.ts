import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsofserviceComponent } from './termsofservice.component';

describe('TermsofserviceComponent', () => {
  let component: TermsofserviceComponent;
  let fixture: ComponentFixture<TermsofserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsofserviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsofserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
