import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaquetesTarifasService, TarifaDocumento } from '../../services/paquetes-tarifas.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-paquetes-tarifas',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './paquetes-tarifas.component.html',
  styleUrls: ['./paquetes-tarifas.component.scss']
})
export class PaquetesTarifasComponent implements OnInit {
  rol: string = 'masivo';
  documentos: TarifaDocumento[] = [];

  documentosSMS: TarifaDocumento[] = [];
  documentosDatos: TarifaDocumento[] = [];
  documentosVoz: TarifaDocumento[] = [];
  documentosOtros: TarifaDocumento[] = [];

  constructor(private tarifasService: PaquetesTarifasService) {}

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol') || 'masivo';
    this.documentos = this.tarifasService.getDocumentos();
    this.filtrarPorSecciones();
  }

  filtrarPorSecciones(): void {
    const filtro = (this.rol === 'superAdmin' || this.rol === 'admin')
      ? () => true
      : (d: TarifaDocumento) => d.perfil === this.rol;

    this.documentosSMS = this.documentos.filter(d => d.categoria === 'sms' && filtro(d));
    this.documentosDatos = this.documentos.filter(d => d.categoria === 'datos' && filtro(d));
    this.documentosVoz = this.documentos.filter(d => d.categoria === 'voz' && filtro(d));
    this.documentosOtros = this.documentos.filter(d => d.categoria === 'maritimo-aereo' && filtro(d));
  }
}
