import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifasGranelAdminComponent } from './tarifas-granel-admin.component';

describe('TarifasGranelAdminComponent', () => {
  let component: TarifasGranelAdminComponent;
  let fixture: ComponentFixture<TarifasGranelAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarifasGranelAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarifasGranelAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
