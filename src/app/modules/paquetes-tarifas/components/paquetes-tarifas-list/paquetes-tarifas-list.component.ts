import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaquetesTarifasService, TarifaDocumento } from '../../../../services/paquetes-tarifas.service';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-paquetes-tarifas-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatPaginatorModule],
  templateUrl: './paquetes-tarifas-list.component.html',
  styleUrls: ['./paquetes-tarifas-list.component.scss']
})
export class PaquetesTarifasListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  categoriaRuta: string = '';
  documentos: TarifaDocumento[] = [];
  rolUsuario: string = '';

  // 🔹 Paginación
  paginaActual: number = 0; // ¡Importante! Angular Material usa index base 0
  elementosPorPagina: number = 5;

  constructor(
    private route: ActivatedRoute,
    private tarifasService: PaquetesTarifasService
  ) {}

  ngOnInit(): void {
    this.rolUsuario = localStorage.getItem('rol') || '';

    this.route.paramMap.subscribe(params => {
      this.categoriaRuta = params.get('categoria') || '';
      this.documentos = this.tarifasService.getDocumentosPorRutaCategoria(this.categoriaRuta);
      this.paginaActual = 0;
    });
  }

  // 🔸 Getter para mostrar solo los documentos de la página actual
  get documentosPaginados(): TarifaDocumento[] {
    const inicio = this.paginaActual * this.elementosPorPagina;
    return this.documentos.slice(inicio, inicio + this.elementosPorPagina);
  }

  // 🔸 Evento del paginador
  actualizarPaginacion(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.elementosPorPagina = event.pageSize;
  }

  // 🔸 Ícono según extensión
  getIconoPorTipoArchivo(nombre: string): string {
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.endsWith('.pdf')) return 'picture_as_pdf';
    if (nombreLower.endsWith('.xlsx') || nombreLower.endsWith('.xls')) return 'grid_on';
    if (nombreLower.endsWith('.doc') || nombreLower.endsWith('.docx')) return 'description';
    return 'insert_drive_file';
  }
}
