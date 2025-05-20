import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { ArchivoService } from '../../services/archivo.service';
import { Archivo } from '../../models/archivo.model';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-gerencia-admin-ri',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatMenuModule
  ],
  templateUrl: './gerencia-admin-ri.component.html',
  styleUrls: ['./gerencia-admin-ri.component.scss']
})
export class GerenciaAdminRiComponent implements OnInit, AfterViewInit {

  private archivoService = inject(ArchivoService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild('inputManual') inputManual!: any;

  rol = signal<string | null>(null);
  usuario = signal<string | null>(null);
  numeroControl = signal<string | null>(null);

  dataSourceMap: Record<string, MatTableDataSource<Archivo>> = {};
  archivos = signal<Record<string, Archivo[]>>({});

  nuevoArchivo = {
    nombre: '',
    archivo: null as File | null
  };

  categoriaSeleccionada: string = '';

  // Alertas y confirmación
  alerta: { tipo: 'success' | 'error'; mensaje: string } | null = null;
  confirmacionVisible = false;
  archivoAEliminar: { nombre: string; categoria: string } | null = null;

  categoriasDisponibles = computed(() => {
    const r = this.rol();
    if (r === 'superAdmin') return ['cci', 'cce', 'calidad'];
    if (r === 'auditor') return ['calidad'];
    if (r === 'cci') return ['cci'];
    if (r === 'cce') return ['cce'];
    return [];
  });

  ngOnInit(): void {
    this.rol.set(this.authService.getRol());
    this.usuario.set(localStorage.getItem('usuario'));
    this.numeroControl.set(this.authService.getNumeroControl());
    this.cargarArchivos();
  }

  ngAfterViewInit(): void {
    for (const cat of Object.keys(this.dataSourceMap)) {
      this.dataSourceMap[cat].paginator = this.paginator;
    }
  }

  abrirInputManual(): void {
  this.inputManual?.nativeElement?.click();
}

abrirInputCategoria(categoria: string): void {
  const input = document.querySelector(`input[data-categoria="${categoria}"]`) as HTMLInputElement;
  input?.click();
}
  cargarArchivos(): void {
    const estado: Record<string, Archivo[]> = {};
    for (const cat of this.categoriasDisponibles()) {
      const archivos = this.archivoService.obtenerArchivos(cat as any);
      estado[cat] = archivos;
      this.dataSourceMap[cat] = new MatTableDataSource<Archivo>(archivos);
    }
    this.archivos.set(estado);
  }

  subirArchivo(event: any, categoria: string): void {
    const file = event.target.files[0];
    if (!file) return;

    const msg = this.archivoService.subirArchivo(
      file,
      categoria as any,
      this.usuario()!,
      this.numeroControl()!
    );

    this.mostrarAlerta(msg ?? 'Archivo subido correctamente', !!msg);
    this.cargarArchivos();
  }

  eliminarArchivo(nombre: string, categoria: string): void {
    this.archivoService.eliminarArchivo(categoria as any, nombre);
    this.mostrarAlerta('Archivo eliminado correctamente', false);
    this.cargarArchivos();
  }

  actualizarArchivo(event: any, archivoOriginal: Archivo): void {
    const nuevoArchivo = event.target.files[0];
    if (!nuevoArchivo) return;

    const msg = this.archivoService.actualizarArchivo(
      archivoOriginal.categoria,
      archivoOriginal.nombre,
      nuevoArchivo,
      this.usuario()!,
      this.numeroControl()!
    );

    this.mostrarAlerta(msg ?? 'Archivo actualizado correctamente', !!msg);
    this.cargarArchivos();
  }

  descargarArchivo(archivo: Archivo): void {
    if (!archivo.archivo) {
      this.mostrarAlerta('Archivo no disponible para descargar', true);
      return;
    }

    const url = URL.createObjectURL(archivo.archivo);
    const a = document.createElement('a');
    a.href = url;
    a.download = archivo.nombre;
    a.click();
    URL.revokeObjectURL(url);
  }

  puedeSubir(categoria: string): boolean {
    const r = this.rol();
    return r === 'superAdmin' || (r === 'auditor' && categoria === 'calidad');
  }

  getDisplayedColumns(): string[] {
    return ['nombre', 'fechaSubida', 'tamanoMB', 'acciones'];
  }

  seleccionarArchivo(event: any): void {
    const file = event.target.files[0];
    this.nuevoArchivo.archivo = file;
  }

  agregarArchivoManual(categoria: string): void {
    const { nombre, archivo } = this.nuevoArchivo;

    if (!nombre || !archivo) {
      this.mostrarAlerta('Completa todos los campos', true);
      return;
    }

    const fakeFile = new File([archivo], nombre, { type: archivo.type });
    const msg = this.archivoService.subirArchivo(
      fakeFile,
      categoria as any,
      this.usuario()!,
      this.numeroControl()!
    );

    this.mostrarAlerta(msg ?? 'Archivo agregado correctamente', !!msg);
    this.nuevoArchivo = { nombre: '', archivo: null };
    this.cargarArchivos();
  }

  // Confirmación
  pedirConfirmacion(nombre: string, categoria: string): void {
    this.archivoAEliminar = { nombre, categoria };
    this.confirmacionVisible = true;
  }

  confirmarEliminacion(): void {
    if (this.archivoAEliminar) {
      this.eliminarArchivo(this.archivoAEliminar.nombre, this.archivoAEliminar.categoria);
    }
    this.confirmacionVisible = false;
    this.archivoAEliminar = null;
  }

  cancelarEliminacion(): void {
    this.confirmacionVisible = false;
    this.archivoAEliminar = null;
  }

  mostrarAlerta(mensaje: string, esError: boolean): void {
    this.alerta = {
      mensaje,
      tipo: esError ? 'error' : 'success'
    };
    setTimeout(() => {
      this.alerta = null;
    }, 3000);
  }
}
