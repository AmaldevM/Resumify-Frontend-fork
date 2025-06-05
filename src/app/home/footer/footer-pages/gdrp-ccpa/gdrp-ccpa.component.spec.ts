import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GDRPCCPAComponent } from './gdrp-ccpa.component';

describe('GDRPCCPAComponent', () => {
  let component: GDRPCCPAComponent;
  let fixture: ComponentFixture<GDRPCCPAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GDRPCCPAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GDRPCCPAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
