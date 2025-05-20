import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatMenuModule } from '@angular/material/menu';

import { Notificacion } from '../../../../models/notificacion.model';
import { NotificacionesService } from '../../../../services/notificaciones.service';
import { AuthService } from '../../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notificaciones-admin',
  standalone: true,
  templateUrl: './notificaciones-admin.component.html',
  styleUrls: ['./notificaciones-admin.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class NotificacionesAdminComponent implements OnInit, AfterViewInit {

  nuevaNotificacion: Partial<Notificacion> = {
    nombre: '',
    descripcion: '',
    perfil: 'corporativo'
  };

  archivoSeleccionado: File | null = null;
  notificaciones: Notificacion[] = [];
  notificacionesCorporativoDS = new MatTableDataSource<Notificacion>();
  notificacionesMasivoDS = new MatTableDataSource<Notificacion>();

  @ViewChild('corporativoPaginator') corporativoPaginator!: MatPaginator;
  @ViewChild('masivoPaginator') masivoPaginator!: MatPaginator;

  nextId: number = 100;
  alerta: { tipo: 'success' | 'error', mensaje: string } | null = null;

  idAEliminar: number | null = null;
  confirmacionVisible: boolean = false;
  modoEdicion: boolean = false;
  notificacionEnEdicion: Notificacion | null = null;
  rolUsuario: string | null = null;

  displayedColumns = ['nombre', 'descripcion', 'fechaPublicacion', 'perfil', 'acciones'];

  constructor(
    private notificacionesService: NotificacionesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.rolUsuario = this.authService.getRol();
    this.notificacionesService.getNotificaciones().subscribe(data => {
      this.filtrarNotificaciones(data);
    });
  }

  ngAfterViewInit(): void {
    this.notificacionesCorporativoDS.paginator = this.corporativoPaginator;
    this.notificacionesMasivoDS.paginator = this.masivoPaginator;
  }

  filtrarNotificaciones(data: Notificacion[]) {
    this.notificaciones = data;

    this.notificacionesCorporativoDS.data = data.filter(n => n.perfil === 'corporativo');
    this.notificacionesMasivoDS.data = data.filter(n => n.perfil === 'masivo');

    const rol = this.rolUsuario;

    if (rol === 'superAdmin') {
      // Puede ver todo
    } else if (rol === 'admin') {
      this.notificaciones = data.filter(n => n.perfil === 'corporativo' || n.perfil === 'masivo');
    } else if (rol === 'corporativo') {
      this.notificaciones = data.filter(n => n.perfil === 'corporativo');
    } else if (rol === 'masivo') {
      this.notificaciones = data.filter(n => n.perfil === 'masivo');
    } else {
      this.notificaciones = [];
    }
  }

  mostrarAlertaSuccess(mensaje: string) {
    this.alerta = { tipo: 'success', mensaje };
    setTimeout(() => this.alerta = null, 3000);
  }

  mostrarAlertaError(mensaje: string) {
    this.alerta = { tipo: 'error', mensaje };
    setTimeout(() => this.alerta = null, 3000);
  }

  agregarOActualizarNotificacion() {
    if (!this.nuevaNotificacion.nombre || !this.nuevaNotificacion.descripcion) {
      this.mostrarAlertaError('Todos los campos son obligatorios');
      return;
    }

    if (this.modoEdicion && this.notificacionEnEdicion) {
      this.notificacionEnEdicion.nombre = this.nuevaNotificacion.nombre!;
      this.notificacionEnEdicion.descripcion = this.nuevaNotificacion.descripcion!;
      this.notificacionEnEdicion.perfil = this.nuevaNotificacion.perfil as 'corporativo' | 'masivo';

      if (this.archivoSeleccionado) {
        const nuevoArchivoUrl = URL.createObjectURL(this.archivoSeleccionado);
        this.notificacionEnEdicion.archivoUrl = nuevoArchivoUrl;
      }

      this.mostrarAlertaSuccess('¡Notificación actualizada correctamente!');
    } else {
      if (!this.archivoSeleccionado) {
        this.mostrarAlertaError('Debes seleccionar un archivo');
        return;
      }

      const archivoUrl = URL.createObjectURL(this.archivoSeleccionado);

      const nueva: Notificacion = {
        id: this.nextId++,
        nombre: this.nuevaNotificacion.nombre!,
        descripcion: this.nuevaNotificacion.descripcion!,
        fechaPublicacion: new Date(),
        archivoUrl: archivoUrl,
        perfil: this.nuevaNotificacion.perfil as 'corporativo' | 'masivo'
      };

      this.notificacionesService.agregarNotificacion(nueva);
      this.mostrarAlertaSuccess('¡Notificación agregada correctamente!');
    }

    this.resetearFormulario();
  }

  resetearFormulario() {
    this.nuevaNotificacion = {
      nombre: '',
      descripcion: '',
      perfil: 'corporativo'
    };
    this.archivoSeleccionado = null;
    this.modoEdicion = false;
    this.notificacionEnEdicion = null;
  }

  pedirConfirmacion(id: number) {
    this.idAEliminar = id;
    this.confirmacionVisible = true;
  }

  confirmarEliminacion() {
    if (this.idAEliminar !== null) {
      this.notificacionesService.eliminarNotificacion(this.idAEliminar);
      this.notificaciones = this.notificaciones.filter(n => n.id !== this.idAEliminar);
      this.mostrarAlertaSuccess('Notificación eliminada correctamente');
      this.idAEliminar = null;
      this.confirmacionVisible = false;
      this.filtrarNotificaciones(this.notificaciones);
    }
  }

  cancelarEliminacion() {
    this.idAEliminar = null;
    this.confirmacionVisible = false;
  }

  cancelarEdicion() {
    this.resetearFormulario();
  }

  editar(notificacion: Notificacion) {
    this.modoEdicion = true;
    this.notificacionEnEdicion = notificacion;

    this.nuevaNotificacion = {
      nombre: notificacion.nombre,
      descripcion: notificacion.descripcion,
      perfil: notificacion.perfil
    };
    this.archivoSeleccionado = null;
  }

  seleccionarArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    this.archivoSeleccionado = input.files && input.files.length > 0 ? input.files[0] : null;
  }
}
