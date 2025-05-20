import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { SabiasQueDocumento } from '../../models/sabias-que.model';
import { SabiasQueService } from '../../services/sabias-que.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-sabias-que',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './sabias-que.component.html',
  styleUrls: ['./sabias-que.component.scss']
})
export class SabiasQueComponent implements OnInit {
  documentos: SabiasQueDocumento[] = [];

  comunicados: SabiasQueDocumento[] = [];
  mesAnterior: SabiasQueDocumento[] = [];
  anio2024: SabiasQueDocumento[] = [];

  comunicadosPaginados: SabiasQueDocumento[] = [];
  mesAnteriorPaginados: SabiasQueDocumento[] = [];
  anio2024Paginados: SabiasQueDocumento[] = [];

  pageSize = 3;
  documentoSeleccionado: SabiasQueDocumento | null = null;

  rol: string | null = null;

  modoEdicion: boolean = false;
  documentosOcultos: number[] = [];

  nuevo: Partial<SabiasQueDocumento> = {
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    url: ''
  };

  alerta: { tipo: 'success' | 'error'; mensaje: string } | null = null;

  @ViewChild('formularioRef') formularioRef!: ElementRef;

  constructor(private sabiasQueService: SabiasQueService) {}

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol');

    this.sabiasQueService.getDocumentos().subscribe((docs) => {
      this.documentos = docs;

      this.comunicados = docs.filter(d => d.categoria === 'comunicados');
      this.mesAnterior = docs.filter(d => d.categoria === 'mes-anterior');
      this.anio2024 = docs.filter(d => d.categoria === 'anio-2024');

      this.comunicadosPaginados = this.comunicados.slice(0, this.pageSize);
      this.mesAnteriorPaginados = this.mesAnterior.slice(0, this.pageSize);
      this.anio2024Paginados = this.anio2024.slice(0, this.pageSize);
    });
  }

  handlePage(event: PageEvent, categoria: string): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;

    switch (categoria) {
      case 'comunicados':
        this.comunicadosPaginados = this.comunicados.slice(startIndex, endIndex);
        break;
      case 'mesAnterior':
        this.mesAnteriorPaginados = this.mesAnterior.slice(startIndex, endIndex);
        break;
      case 'anio2024':
        this.anio2024Paginados = this.anio2024.slice(startIndex, endIndex);
        break;
    }
  }

  abrirDetalle(doc: SabiasQueDocumento): void {
    this.documentoSeleccionado = doc;
  }

  cerrarDetalle(): void {
    this.documentoSeleccionado = null;
  }

  guardarComunicado(): void {
    const { titulo, descripcion, imagenUrl, url } = this.nuevo;

    if (!titulo || !descripcion || !imagenUrl) {
      this.mostrarAlerta('error', 'Completa todos los campos antes de guardar.');
      return;
    }

    const nuevoDoc: SabiasQueDocumento = {
      id: this.modoEdicion && this.nuevo.id ? this.nuevo.id : Date.now(),
      titulo,
      descripcion,
      fecha: new Date().toISOString().split('T')[0],
      imagenUrl,
      categoria: 'comunicados',
      url: url?.trim() || undefined
    };

    this.sabiasQueService.agregarDocumento(nuevoDoc);

    if (this.modoEdicion && this.nuevo.id) {
      // Restaurar visualmente si estaba oculto
      this.documentosOcultos = this.documentosOcultos.filter(id => id !== this.nuevo.id);
    }

    this.resetFormulario();

    const mensaje = this.modoEdicion ? 'Comunicado actualizado correctamente.' : 'Comunicado agregado correctamente.';
    this.mostrarAlerta('success', mensaje);
  }

  resetFormulario(): void {
    this.nuevo = {
      titulo: '',
      descripcion: '',
      imagenUrl: '',
      url: ''
    };
    this.modoEdicion = false;
  }

  cancelarEdicion(): void {
    if (this.nuevo.id) {
      this.documentosOcultos = this.documentosOcultos.filter(id => id !== this.nuevo.id);
    }
    this.resetFormulario();
    this.mostrarAlerta('error', 'Edición cancelada.');
  }

  mostrarAlerta(tipo: 'success' | 'error', mensaje: string): void {
    this.alerta = { tipo, mensaje };
    setTimeout(() => (this.alerta = null), 3000);
  }

  abrirEnlace(url: string): void {
    window.open(url, '_blank');
  }

  rolEsAdmin(): boolean {
    return this.rol === 'superAdmin';
  }

  editarDirecto(doc: SabiasQueDocumento, event: MouseEvent): void {
    event.stopPropagation();
    this.nuevo = { ...doc };
    this.documentosOcultos.push(doc.id);
    this.modoEdicion = true;
    this.mostrarAlerta('success', 'Puedes editar el comunicado en el formulario superior.');

    setTimeout(() => {
      this.formularioRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  eliminarDirecto(doc: SabiasQueDocumento, event: MouseEvent): void {
    event.stopPropagation();
    const confirmado = confirm(`¿Seguro que deseas eliminar "${doc.titulo}"?`);
    if (confirmado) {
      this.sabiasQueService.eliminarDocumento(doc.id);
      this.mostrarAlerta('success', 'Comunicado eliminado correctamente.');
    }
  }
  manejarClick(doc: SabiasQueDocumento): void {
  if (doc.url && doc.url.trim() !== '') {
    this.abrirEnlace(doc.url);
  } else {
    this.abrirDetalle(doc);
  }
}

}