import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesTarifasListComponent } from './paquetes-tarifas-list.component';

describe('PaquetesTarifasListComponent', () => {
  let component: PaquetesTarifasListComponent;
  let fixture: ComponentFixture<PaquetesTarifasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaquetesTarifasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaquetesTarifasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
