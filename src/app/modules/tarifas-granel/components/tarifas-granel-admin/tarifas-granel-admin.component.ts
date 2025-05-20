import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';

import { TarifaGranelDocumento, TarifasGranelService } from '../../../../services/tarifas-granel.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-tarifas-granel-admin',
  standalone: true,
  templateUrl: './tarifas-granel-admin.component.html',
  styleUrls: ['./tarifas-granel-admin.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatPaginatorModule,
    MatMenuModule
  ]
})
export class TarifasGranelAdminComponent implements OnInit, AfterViewInit {
  rol: 'superAdmin' | 'admin' | 'corporativo' | 'masivo' = 'masivo';

  columnas: string[] = ['titulo', 'descripcion', 'fecha', 'acciones'];

  datosDS = new MatTableDataSource<TarifaGranelDocumento>();
  vozDS = new MatTableDataSource<TarifaGranelDocumento>();
  smsDS = new MatTableDataSource<TarifaGranelDocumento>();
  maritimoDS = new MatTableDataSource<TarifaGranelDocumento>();

  @ViewChild('datosPaginator') datosPaginator!: MatPaginator;
  @ViewChild('vozPaginator') vozPaginator!: MatPaginator;
  @ViewChild('smsPaginator') smsPaginator!: MatPaginator;
  @ViewChild('maritimoPaginator') maritimoPaginator!: MatPaginator;
  @ViewChild('formulario') formularioRef!: ElementRef<HTMLDivElement>;

  alerta: { tipo: 'success' | 'error'; mensaje: string } | null = null;
  confirmacionVisible = false;
  documentoPendiente: TarifaGranelDocumento | null = null;

  archivoSeleccionado: File | null = null;

  nuevoDocumento: Omit<TarifaGranelDocumento, 'id' | 'fecha'> = {
    titulo: '',
    descripcion: '',
    categoria: 'datos',
    archivo: ''
  };

  modoEdicion: boolean = false;
  documentoEnEdicionId: string | null = null;

  bannerImagen: string = '';

  constructor(private granelService: TarifasGranelService) {}

  ngOnInit(): void {
    const storedRol = localStorage.getItem('rol');
    this.rol = (storedRol as any) || 'masivo';

    this.bannerImagen = this.granelService.getBannerImagen();
    this.recargarTablas();
  }

  ngAfterViewInit(): void {
    this.datosDS.paginator = this.datosPaginator;
    this.vozDS.paginator = this.vozPaginator;
    this.smsDS.paginator = this.smsPaginator;
    this.maritimoDS.paginator = this.maritimoPaginator;
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (archivo && archivo.type === 'application/pdf') {
      this.archivoSeleccionado = archivo;
    } else {
      this.archivoSeleccionado = null;
      this.mostrarAlerta('error', 'Solo se permiten archivos PDF.');
    }
  }

  subirArchivo(): void {
    const { titulo, descripcion, categoria } = this.nuevoDocumento;

    if (!titulo || !descripcion || !categoria || !this.archivoSeleccionado) {
      this.mostrarAlerta('error', 'Completa todos los campos y selecciona un archivo.');
      return;
    }

    const url = URL.createObjectURL(this.archivoSeleccionado);
    const nuevo: TarifaGranelDocumento = {
      id: crypto.randomUUID(),
      titulo,
      descripcion,
      categoria,
      archivo: url,
      fecha: new Date().toISOString().split('T')[0]
    };

    this.granelService.agregarDocumento(nuevo);
    this.recargarTablas();
    this.mostrarAlerta('success', 'Documento agregado correctamente.');
    this.resetFormulario();
  }

  actualizarArchivo(): void {
    if (!this.documentoEnEdicionId || !this.nuevoDocumento.titulo || !this.nuevoDocumento.descripcion || !this.nuevoDocumento.categoria) {
      this.mostrarAlerta('error', 'Completa todos los campos.');
      return;
    }

    const urlActualizada = this.archivoSeleccionado
      ? URL.createObjectURL(this.archivoSeleccionado)
      : this.nuevoDocumento.archivo;

    const actualizado: TarifaGranelDocumento = {
      id: this.documentoEnEdicionId,
      titulo: this.nuevoDocumento.titulo,
      descripcion: this.nuevoDocumento.descripcion,
      categoria: this.nuevoDocumento.categoria,
      archivo: urlActualizada,
      fecha: new Date().toISOString().split('T')[0]
    };

    this.granelService.actualizarDocumento(actualizado);
    this.recargarTablas();
    this.mostrarAlerta('success', 'Documento actualizado correctamente.');
    this.resetFormulario();
  }

cargarParaActualizar(doc: TarifaGranelDocumento): void {
  this.nuevoDocumento = {
    titulo: doc.titulo,
    descripcion: doc.descripcion,
    categoria: doc.categoria,
    archivo: doc.archivo
  };
  this.documentoEnEdicionId = doc.id;
  this.modoEdicion = true;

  // Scroll suave hacia el formulario
  setTimeout(() => {
    this.formularioRef?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, 100);
}


  guardarImagenBanner(): void {
    this.granelService.actualizarBannerImagen(this.bannerImagen);
    this.mostrarAlerta('success', 'Imagen del banner actualizada.');
  }

  pedirConfirmacion(id: string): void {
    const todos = [
      ...this.datosDS.data,
      ...this.vozDS.data,
      ...this.smsDS.data,
      ...this.maritimoDS.data
    ];
    this.documentoPendiente = todos.find(d => d.id === id) || null;
    this.confirmacionVisible = true;
  }

  confirmarEliminacion(): void {
    if (this.documentoPendiente) {
      this.granelService.eliminarDocumento(this.documentoPendiente.id);
      this.recargarTablas();
      this.mostrarAlerta('success', 'Documento eliminado.');
    }
    this.cancelarEliminacion();
  }

  cancelarEliminacion(): void {
    this.documentoPendiente = null;
    this.confirmacionVisible = false;
  }

  mostrarAlerta(tipo: 'success' | 'error', mensaje: string): void {
    this.alerta = { tipo, mensaje };
    setTimeout(() => (this.alerta = null), 3000);
  }

  resetFormulario(): void {
    this.nuevoDocumento = {
      titulo: '',
      descripcion: '',
      categoria: 'datos',
      archivo: ''
    };
    this.archivoSeleccionado = null;
    this.modoEdicion = false;
    this.documentoEnEdicionId = null;
  }

  private recargarTablas(): void {
    this.datosDS.data = this.granelService.getPorCategoria('datos');
    this.vozDS.data = this.granelService.getPorCategoria('voz');
    this.smsDS.data = this.granelService.getPorCategoria('sms');
    this.maritimoDS.data = this.granelService.getPorCategoria('maritimo');
  }
}
