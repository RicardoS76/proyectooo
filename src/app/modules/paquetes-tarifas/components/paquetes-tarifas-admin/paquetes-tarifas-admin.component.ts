import { Component, OnInit, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { PaquetesTarifasService, TarifaDocumento } from '../../../../services/paquetes-tarifas.service';

// ... tus imports no cambian ...

@Component({
  selector: 'app-paquetes-tarifas-admin',
  standalone: true,
  templateUrl: './paquetes-tarifas-admin.component.html',
  styleUrls: ['./paquetes-tarifas-admin.component.scss'],
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
    MatPaginatorModule
  ]
})
export class PaquetesTarifasAdminComponent implements OnInit, AfterViewInit {
  rol: 'corporativo' | 'masivo' | 'admin' | 'superAdmin' = 'masivo';

  archivos: TarifaDocumento[] = [];
  archivosCorporativoDS = new MatTableDataSource<TarifaDocumento>();
  archivosMasivoDS = new MatTableDataSource<TarifaDocumento>();

  @ViewChild('corporativoPaginator') corporativoPaginator!: MatPaginator;
  @ViewChild('masivoPaginator') masivoPaginator!: MatPaginator;
  @ViewChild('formulario') formularioRef!: ElementRef<HTMLDivElement>;


  archivoSeleccionado: File | null = null;
  imagenSeleccionada: File | null = null;
  bannerUrl: string = '';

  alerta: { tipo: 'success' | 'error'; mensaje: string } | null = null;
  confirmacionVisible = false;
  archivoPendiente: TarifaDocumento | null = null;
  subcategorias: string[] = [];

  nuevoArchivo: Omit<TarifaDocumento, 'id' | 'fecha'> = {
    titulo: '',
    descripcion: '',
    perfil: 'corporativo',
    categoria: 'voz',
    subcategoria: undefined,
    archivo: ''
  };

  modoEdicion: boolean = false;
  archivoEnEdicionId: string | null = null;

  constructor(private tarifasService: PaquetesTarifasService) {}

  ngOnInit(): void {
    const storedRol = localStorage.getItem('rol');
    this.rol = (storedRol as any) || 'masivo';
    this.cargarArchivos();
  }

  ngAfterViewInit(): void {
    this.archivosCorporativoDS.paginator = this.corporativoPaginator;
    this.archivosMasivoDS.paginator = this.masivoPaginator;
  }

  cargarArchivos(): void {
    this.archivos = this.tarifasService.getDocumentos();
    this.archivosCorporativoDS.data = this.archivos.filter(a => a.perfil === 'corporativo');
    this.archivosMasivoDS.data = this.archivos.filter(a => a.perfil === 'masivo');
  }

  actualizarSubcategorias(): void {
    const categoria = this.nuevoArchivo.categoria;
    this.subcategorias = this.obtenerSubcategorias(categoria);
    this.nuevoArchivo.subcategoria = undefined;
  }

  obtenerSubcategorias(categoria: string): string[] {
    if (categoria === 'datos') {
      return ['prepago', 'pospago', 'controlado'];
    } else if (categoria === 'voz') {
      return ['pospago'];
    }
    return [];
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (archivo && archivo.type === 'application/pdf') {
      this.archivoSeleccionado = archivo;
    } else {
      this.archivoSeleccionado = null;
      this.mostrarAlerta('error', 'Debes seleccionar un archivo PDF válido.');
    }
  }

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (archivo && archivo.type.startsWith('image/')) {
      this.imagenSeleccionada = archivo;
      this.bannerUrl = URL.createObjectURL(archivo);
      this.mostrarAlerta('success', 'Imagen actualizada correctamente.');
    } else {
      this.imagenSeleccionada = null;
      this.mostrarAlerta('error', 'Selecciona una imagen válida.');
    }
  }

  archivoValidoParaSubir(): boolean {
    const { titulo, descripcion, perfil, categoria } = this.nuevoArchivo;
    const camposCompletos = !!titulo && !!descripcion && !!perfil && !!categoria;
    return camposCompletos && (this.archivoSeleccionado instanceof File || this.modoEdicion);
  }

  subirArchivo(): void {
    if (!this.archivoValidoParaSubir()) {
      this.mostrarAlerta('error', 'Completa todos los campos y selecciona un archivo.');
      return;
    }

    const fakeUrl = URL.createObjectURL(this.archivoSeleccionado!);

    this.tarifasService.agregarDocumento({
      ...this.nuevoArchivo,
      archivo: fakeUrl
    });

    this.resetFormulario();
    this.cargarArchivos();
    this.mostrarAlerta('success', 'Archivo cargado correctamente.');
  }

cargarParaActualizar(archivo: TarifaDocumento): void {
  this.nuevoArchivo = {
    titulo: archivo.titulo,
    descripcion: archivo.descripcion,
    perfil: archivo.perfil,
    categoria: archivo.categoria,
    subcategoria: archivo.subcategoria,
    archivo: archivo.archivo
  };
  this.archivoEnEdicionId = archivo.id;
  this.modoEdicion = true;
  this.subcategorias = this.obtenerSubcategorias(archivo.categoria);

  // Scroll hacia el formulario
  this.formularioRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


  actualizarArchivo(): void {
    if (!this.archivoEnEdicionId || !this.archivoValidoParaSubir()) {
      this.mostrarAlerta('error', 'Completa todos los campos y selecciona un archivo.');
      return;
    }

    const urlActualizada = this.archivoSeleccionado
      ? URL.createObjectURL(this.archivoSeleccionado)
      : this.nuevoArchivo.archivo;

    const actualizado: TarifaDocumento = {
      id: this.archivoEnEdicionId,
      ...this.nuevoArchivo,
      archivo: urlActualizada,
      fecha: new Date().toISOString().split('T')[0]
    };

    this.tarifasService.actualizarDocumento(actualizado);
    this.resetFormulario();
    this.cargarArchivos();
    this.mostrarAlerta('success', 'Archivo actualizado correctamente.');
  }

  pedirConfirmacion(archivoId: string): void {
    this.archivoPendiente = this.archivos.find(a => a.id === archivoId) || null;
    this.confirmacionVisible = true;
  }

  confirmarEliminacion(): void {
    if (this.archivoPendiente) {
      this.tarifasService.eliminarDocumento(this.archivoPendiente.id);
      this.cargarArchivos();
      this.mostrarAlerta('success', 'Archivo eliminado.');
    }
    this.cancelarEliminacion();
  }

  cancelarEliminacion(): void {
    this.archivoPendiente = null;
    this.confirmacionVisible = false;
  }

  // 🔓 Este método ahora es público para que se pueda usar desde el HTML
  resetFormulario(): void {
    this.nuevoArchivo = {
      titulo: '',
      descripcion: '',
      perfil: 'corporativo',
      categoria: 'voz',
      subcategoria: undefined,
      archivo: ''
    };
    this.archivoSeleccionado = null;
    this.subcategorias = [];
    this.modoEdicion = false;
    this.archivoEnEdicionId = null;
  }

  private mostrarAlerta(tipo: 'success' | 'error', mensaje: string): void {
    this.alerta = { tipo, mensaje };
    setTimeout(() => (this.alerta = null), 3000);
  }

  getGoogleViewerUrl(url: string): string {
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  }
}
