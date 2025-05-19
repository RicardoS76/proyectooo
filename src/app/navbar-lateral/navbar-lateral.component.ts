import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service'; // ajusta el path según tu estructura
import { LinksService } from '../services/links.service';

@Component({
  selector: 'app-navbar-lateral',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-lateral.component.html',
  styleUrls: ['./navbar-lateral.component.scss']
})
export class NavbarLateralComponent implements OnInit, AfterViewInit {
  isCollapsed = false;
  rolUsuario: string = '';
  numeroControl: string = '';
  menu: any[] = [];
  toggleTarifasSubmenu: boolean = false;


  @ViewChild('cerrarSesionModalRef', { static: false }) cerrarSesionModalRef!: ElementRef;
  private modalInstance: any;

  private authService = inject(AuthService); // Standalone-friendly inyección de dependencias

  constructor(private router: Router, public links: LinksService) {}

  ngOnInit(): void {
    this.rolUsuario = this.authService.getRol() || 'Invitado';
    this.numeroControl = this.authService.getNumeroControl() || 'Sin NC';
    this.setMenuPorRol();
    console.log('Rol:', this.rolUsuario);
console.log('Número de control:', this.numeroControl);

  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  ngAfterViewInit(): void {
    this.initTooltips();
    this.initModal();
  }

  initTooltips(): void {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach((el) => {
      new (window as any).bootstrap.Tooltip(el);
    });
  }

  initModal(): void {
    if (this.cerrarSesionModalRef?.nativeElement) {
      this.modalInstance = new (window as any).bootstrap.Modal(this.cerrarSesionModalRef.nativeElement);
    }
  }

  abrirModal(): void {
    this.modalInstance?.show();
  }

  cerrarModal(): void {
    this.modalInstance?.hide();
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.cerrarModal();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 200);
  }

  shouldHideNavbar(): boolean {
    return this.router.url === '/404';
  }

  setMenuPorRol(): void {
    const base = [
      { title: 'Dashboard', icon: 'dashboard', path: 'dashboard' },
      { title: 'Principal', icon: 'home', path: 'principal' },
      { title: 'Activa tus datos estando de viaje', icon: 'wifi', path: 'activa-datos' }
    ];

    const corporativo = [
      { title: 'Paquetes y Tarifas', icon: 'description', path: 'paquetes-tarifas' }
    ];

    const masivo = [
      { title: 'Paquetes y Tarifas', icon: 'description', path: 'paquetes-tarifas' }
    ];

    const admin = [
      { title: 'Admin', icon: 'admin_panel_settings', path: 'admin' }
    ];

    switch (this.rolUsuario) {
      case 'superAdmin':
        this.menu = [...base, ...corporativo, ...masivo, ...admin];
        break;
      case 'admin':
        this.menu = [...base, ...corporativo, ...masivo];
        break;
      case 'corporativo':
        this.menu = [...base, ...corporativo];
        break;
      case 'masivo':
        this.menu = [...base, ...masivo];
        break;
      default:
        this.menu = [...base];
    }
  }
}
