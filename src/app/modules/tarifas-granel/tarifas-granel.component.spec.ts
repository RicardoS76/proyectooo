import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifasGranelComponent } from './tarifas-granel.component';

describe('TarifasGranelComponent', () => {
  let component: TarifasGranelComponent;
  let fixture: ComponentFixture<TarifasGranelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarifasGranelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarifasGranelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
