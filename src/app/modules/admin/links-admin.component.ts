import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LinksService } from '../../services/links.service';

@Component({
  selector: 'app-links-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './links-admin.component.html',
  styleUrls: ['./links-admin.component.scss']
})
export class LinksAdminComponent implements OnInit {
  links: Record<string, string> = {};
  linkKeys: string[] = [];

  constructor(private linksService: LinksService) {}

  ngOnInit(): void {
    this.links = this.linksService.getAllLinks();
    this.linkKeys = Object.keys(this.links);
  }

  guardarLink(nombre: string): void {
    const nuevoValor = this.links[nombre]?.trim();
    if (nuevoValor) {
      this.linksService.updateLink(nombre, nuevoValor);
      alert(`El enlace "${nombre}" ha sido actualizado.`);
    } else {
      alert(`El enlace para "${nombre}" no puede estar vacío.`);
    }
  }
}
