import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { TarifaGranelDocumento, TarifasGranelService } from '../../services/tarifas-granel.service';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tarifas-granel',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './tarifas-granel.component.html',
  styleUrls: ['./tarifas-granel.component.scss']
})
export class TarifasGranelComponent implements OnInit, AfterViewInit {
  columnas: string[] = ['titulo', 'descripcion', 'fecha', 'acciones'];

  datos = new MatTableDataSource<TarifaGranelDocumento>([]);
  voz = new MatTableDataSource<TarifaGranelDocumento>([]);
  sms = new MatTableDataSource<TarifaGranelDocumento>([]);
  maritimo = new MatTableDataSource<TarifaGranelDocumento>([]);

  bannerImagen: string = '';

  // Referencias a los paginadores
  @ViewChild('datosPaginator') datosPaginator!: MatPaginator;
  @ViewChild('vozPaginator') vozPaginator!: MatPaginator;
  @ViewChild('smsPaginator') smsPaginator!: MatPaginator;
  @ViewChild('maritimoPaginator') maritimoPaginator!: MatPaginator;

  constructor(private granelService: TarifasGranelService) {}

  ngOnInit(): void {
    this.datos.data = this.granelService.getPorCategoria('datos');
    this.voz.data = this.granelService.getPorCategoria('voz');
    this.sms.data = this.granelService.getPorCategoria('sms');
    this.maritimo.data = this.granelService.getPorCategoria('maritimo');

    this.bannerImagen = this.granelService.getBannerImagen();
  }

  ngAfterViewInit(): void {
    this.datos.paginator = this.datosPaginator;
    this.voz.paginator = this.vozPaginator;
    this.sms.paginator = this.smsPaginator;
    this.maritimo.paginator = this.maritimoPaginator;
  }
}
