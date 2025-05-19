import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisoAdminComponent } from './permiso-admin.component';

describe('PermisoAdminComponent', () => {
  let component: PermisoAdminComponent;
  let fixture: ComponentFixture<PermisoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermisoAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermisoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
