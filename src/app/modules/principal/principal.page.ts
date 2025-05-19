import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { CarruselItem } from '../../models/carrusel-item.model';
import { CarruselService } from '../../services/carrusel.service';
import { GuidesService } from '../../services/guides.service';
import { Guide } from '../../models/guide.model';

import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class PrincipalPage implements OnInit, OnDestroy {
  items: CarruselItem[] = [];
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  private intervalId: any;
  isPaused: boolean = false;

  nuevoSlide = {
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    fechaExpiracion: null as Date | null,
    fechaExposicion: null as Date | null,
    link: ''
  };
  nuevaImagenTemporal: string | null = null;

  rolUsuario: string | null = null;
  alerta: { tipo: 'success' | 'error'; mensaje: string } | null = null;

  guides: Guide[] = [];
  paginatedGuides: Guide[] = [];
  pageSize = 2;
  currentPage = 0;
  totalSize = 0;

  slideSeleccionado: number = 0;
  direccionCarrusel: 'derecha' | 'izquierda' = 'derecha';

  constructor(
    private carruselService: CarruselService,
    private guidesService: GuidesService
  ) {}

  ngOnInit(): void {
    this.rolUsuario = localStorage.getItem('rol');

    this.carruselService.getCarruselItems().subscribe((data) => {
      this.items = data;
      this.startAutoSlide();
    });

    this.guidesService.getGuides().subscribe((data) => {
      this.guides = data;
      this.totalSize = data.length;
      this.paginatedGuides = data.slice(0, this.pageSize);
    });
  }

  mostrarAlerta(tipo: 'success' | 'error', mensaje: string): void {
    this.alerta = { tipo, mensaje };
    setTimeout(() => (this.alerta = null), 4000);
  }

  startAutoSlide(): void {
    this.stopAutoSlide();
    this.intervalId = setInterval(() => {
      if (!this.isPaused && this.tabGroup && this.items.length > 0) {
        const index = this.tabGroup.selectedIndex || 0;
        const total = this.items.length;
        this.tabGroup.selectedIndex =
          this.direccionCarrusel === 'derecha'
            ? (index + 1) % total
            : (index - 1 + total) % total;
      }
    }, 5000);
  }

  stopAutoSlide(): void {
    clearInterval(this.intervalId);
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  nextSlide(): void {
    if (this.tabGroup) {
      const index = this.tabGroup.selectedIndex || 0;
      this.tabGroup.selectedIndex = (index + 1) % this.items.length;
    }
  }

  previousSlide(): void {
    if (this.tabGroup) {
      const index = this.tabGroup.selectedIndex || 0;
      this.tabGroup.selectedIndex = (index - 1 + this.items.length) % this.items.length;
    }
  }

  irASlide(index: number): void {
    if (this.tabGroup && index >= 0 && index < this.items.length) {
      this.tabGroup.selectedIndex = index;
    }
  }

  cambiarDireccion(): void {
    this.startAutoSlide();
  }

  onImageSelected(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.items[index].imagenUrl = e.target.result;
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  onNuevaImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.nuevaImagenTemporal = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  confirmarNuevoSlide(): void {
    if (
      this.nuevoSlide.titulo &&
      this.nuevoSlide.descripcion &&
      this.nuevaImagenTemporal
    ) {
      this.items.push({
        id: this.items.length + 1,
        titulo: this.nuevoSlide.titulo,
        descripcion: this.nuevoSlide.descripcion,
        imagenUrl: this.nuevaImagenTemporal,
        fechaRegistro: new Date(),
        fechaExpiracion: this.nuevoSlide.fechaExpiracion,
        fechaExposicion: this.nuevoSlide.fechaExposicion,
        link: this.nuevoSlide.link?.trim() || undefined
      });

      this.nuevoSlide = {
        titulo: '',
        descripcion: '',
        imagenUrl: '',
        fechaExpiracion: null,
        fechaExposicion: null,
        link: ''
      };
      this.nuevaImagenTemporal = null;

      this.mostrarAlerta('success', 'Nuevo slide agregado correctamente.');
    } else {
      this.mostrarAlerta('error', 'Por favor completa todos los campos antes de confirmar.');
    }
  }

  eliminarSlide(index: number): void {
    if (this.rolUsuario === 'superAdmin') {
      this.items.splice(index, 1);
      this.mostrarAlerta('success', 'Slide eliminado correctamente.');
    }
  }

  cambiarOrdenSlide(indiceActual: number, nuevaPosicion: number): void {
    if (
      nuevaPosicion >= 0 &&
      nuevaPosicion < this.items.length &&
      indiceActual !== nuevaPosicion
    ) {
      const [slide] = this.items.splice(indiceActual, 1);
      this.items.splice(nuevaPosicion, 0, slide);
      this.mostrarAlerta('success', `Slide movido a la posición ${nuevaPosicion + 1}`);
    }
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    const start = this.currentPage * this.pageSize;
    const end = Math.min(start + this.pageSize, this.guides.length);
    this.paginatedGuides = this.guides.slice(start, end);
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }
}
