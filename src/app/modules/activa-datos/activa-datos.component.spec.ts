import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivaDatosComponent } from './activa-datos.component';

describe('ActivaDatosComponent', () => {
  let component: ActivaDatosComponent;
  let fixture: ComponentFixture<ActivaDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivaDatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivaDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
