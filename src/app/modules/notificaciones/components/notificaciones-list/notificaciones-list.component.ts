import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Notificacion } from '../../../../models/notificacion.model';
import { NotificacionesService } from '../../../../services/notificaciones.service';
import { AuthService } from '../../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-notificaciones-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './notificaciones-list.component.html',
  styleUrls: ['./notificaciones-list.component.scss']
})
export class NotificacionesListComponent implements OnInit, AfterViewInit {

  notificaciones: Notificacion[] = [];
  perfilUsuario: 'corporativo' | 'masivo' = 'masivo'; // valor por defecto
  displayedColumns: string[] = ['nombre', 'descripcion', 'fecha', 'descargar'];
  dataSource = new MatTableDataSource<Notificacion>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private notificacionesService: NotificacionesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const rol = this.authService.getRol();
    if (rol === 'corporativo' || rol === 'masivo') {
      this.perfilUsuario = rol;
    }

    this.notificacionesService.getNotificaciones().subscribe((data) => {
      const filtradas = data.filter(n => n.perfil === this.perfilUsuario);
      this.notificaciones = filtradas;
      this.dataSource = new MatTableDataSource<Notificacion>(filtradas);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }
}
