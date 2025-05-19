import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsideracionesAdminComponent } from './consideraciones-admin.component';

describe('ConsideracionesAdminComponent', () => {
  let component: ConsideracionesAdminComponent;
  let fixture: ComponentFixture<ConsideracionesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsideracionesAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsideracionesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
