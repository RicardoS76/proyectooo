import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { DocumentoConsideracion } from '../../../../models/documento-consideracion.model';
import { CarruselItem } from '../../../../models/carrusel-item.model';
import { ConsideracionesService } from '../../../../services/consideraciones.service';
import { CarruselService } from '../../../../services/carrusel.service';

@Component({
  selector: 'app-consideraciones-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTabsModule
  ],
  templateUrl: './consideraciones-admin.component.html',
  styleUrls: ['./consideraciones-admin.component.scss']
})
export class ConsideracionesAdminComponent implements OnInit {
  documentos: DocumentoConsideracion[] = [];
  carruselItems: CarruselItem[] = [];
  carruselItemsPaginated: CarruselItem[] = [];

  itemSeleccionado: CarruselItem | null = null;

  pageSize = 4;
  currentPage = 0;

  nuevo: Partial<DocumentoConsideracion> = {
    nombre: '',
    descripcion: '',
    perfil: 'cci'
  };

  archivoSeleccionado: File | null = null;
  alerta: { tipo: 'success' | 'error'; mensaje: string } | null = null;

  constructor(
    private consideracionesService: ConsideracionesService,
    private carruselService: CarruselService
  ) {}

  ngOnInit(): void {
    this.consideracionesService.getDocumentos().subscribe((docs) => {
      this.documentos = docs;
    });

    this.carruselService.getCarruselItems().subscribe((items) => {
      this.carruselItems = items;
      this.actualizarPaginacion(); // ✅ Inicializa paginados desde inicio
    });
  }

  seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (archivo && archivo.type === 'application/pdf') {
      this.archivoSeleccionado = archivo;
    } else {
      this.alerta = { tipo: 'error', mensaje: 'Selecciona un archivo PDF válido.' };
    }
  }

  agregarDocumento(): void {
    if (!this.nuevo.nombre || !this.nuevo.descripcion || !this.archivoSeleccionado || !this.nuevo.perfil) {
      this.alerta = { tipo: 'error', mensaje: 'Completa todos los campos y selecciona un archivo.' };
      return;
    }

    const archivoUrl = URL.createObjectURL(this.archivoSeleccionado);

    const nuevoDoc: DocumentoConsideracion = {
      id: Date.now(),
      nombre: this.nuevo.nombre,
      descripcion: this.nuevo.descripcion,
      perfil: this.nuevo.perfil as 'cci' | 'cce' | 'calidad' | 'monitoreo',
      fecha: new Date().toISOString().split('T')[0],
      archivoUrl
    };

    this.consideracionesService.agregarDocumento(nuevoDoc);
    this.alerta = { tipo: 'success', mensaje: 'Documento agregado correctamente.' };
    this.resetFormulario();
  }

  resetFormulario(): void {
    this.nuevo = {
      nombre: '',
      descripcion: '',
      perfil: 'cci'
    };
    this.archivoSeleccionado = null;
  }

  abrirDetalle(item: CarruselItem): void {
    this.itemSeleccionado = item;
  }

  cerrarModal(): void {
    this.itemSeleccionado = null;
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.actualizarPaginacion();
  }

  private actualizarPaginacion(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.carruselItemsPaginated = this.carruselItems.slice(start, end);
  }
}
