import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesTarifasComponent } from './paquetes-tarifas.component';

describe('PaquetesTarifasComponent', () => {
  let component: PaquetesTarifasComponent;
  let fixture: ComponentFixture<PaquetesTarifasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaquetesTarifasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaquetesTarifasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
