import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesTarifasAdminComponent } from './paquetes-tarifas-admin.component';

describe('PaquetesTarifasAdminComponent', () => {
  let component: PaquetesTarifasAdminComponent;
  let fixture: ComponentFixture<PaquetesTarifasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaquetesTarifasAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaquetesTarifasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
