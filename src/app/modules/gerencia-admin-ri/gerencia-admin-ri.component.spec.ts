import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaAdminRiComponent } from './gerencia-admin-ri.component';

describe('GerenciaAdminRiComponent', () => {
  let component: GerenciaAdminRiComponent;
  let fixture: ComponentFixture<GerenciaAdminRiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaAdminRiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciaAdminRiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
