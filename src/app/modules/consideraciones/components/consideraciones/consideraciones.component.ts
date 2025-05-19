// consideraciones.component.ts
import { Component, OnInit } from '@angular/core';
import { DocumentoConsideracion } from '../../../../models/documento-consideracion.model';
import { ConsideracionesService } from '../../../../services/consideraciones.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-consideraciones',
  templateUrl: './consideraciones.component.html',
  styleUrls: ['./consideraciones.component.scss'],
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class ConsideracionesComponent implements OnInit {
  documentos: DocumentoConsideracion[] = [];
  documentosFiltrados: DocumentoConsideracion[] = [];
  rol: string | null = null;

  constructor(
    private consideracionesService: ConsideracionesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.rol = this.authService.getRol();

    this.consideracionesService.getDocumentos().subscribe((docs) => {
      this.documentos = docs;
      this.filtrarDocumentosPorRol();
    });
  }

  filtrarDocumentosPorRol(): void {
    if (this.rol === 'superAdmin' || this.rol === 'admin') {
      this.documentosFiltrados = this.documentos;
    } else {
      this.documentosFiltrados = this.documentos.filter(doc => doc.perfil === this.rol);
    }
  }

  abrirDocumento(doc: DocumentoConsideracion): void {
    window.open(doc.archivoUrl, '_blank');
  }
}
