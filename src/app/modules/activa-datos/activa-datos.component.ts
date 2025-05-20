import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import {
  trigger,
  style,
  transition,
  animate
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SistemaOperativo } from '../../models/sistema-operativo.model';
import { SistemasOperativosService } from '../../services/sistemas-operativos.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  standalone: true,
  selector: 'app-activa-datos',
  templateUrl: './activa-datos.component.html',
  styleUrls: ['./activa-datos.component.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class ActivaDatosComponent implements OnInit, OnDestroy {
  sistemas: SistemaOperativo[] = [];
  sistemaSeleccionado?: SistemaOperativo;
  contenidoSeguro?: SafeHtml;
  mostrarInstrucciones = false;
  animar = false;

  rolUsuario: string | null = null;
  leftFlecha: number = 40;

  nuevoSistema: SistemaOperativo = {
    id: '',
    nombre: '',
    imagen: '',
    instruccionesHTML: ''
  };

  imagenTemporal: string | null = null;
  editando = false;
  sistemaEditandoId: string | null = null;

  editorInstance: any;

  @ViewChild('tarjetasColumn', { static: true }) tarjetasColumn!: ElementRef;
@ViewChildren('globo') globos!: QueryList<ElementRef>;
@ViewChild('formularioSistema') formularioSistemaRef!: ElementRef;
@ViewChild('inputNombre') inputNombreRef!: ElementRef;

  constructor(
    private sistemasService: SistemasOperativosService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {


    this.rolUsuario = this.authService.getRol();
    this.sistemas = this.sistemasService.obtenerSistemas();

    setTimeout(() => {
      const editorElement = document.querySelector('#editor') as HTMLElement;
      if (editorElement) {
        ClassicEditor
          .create(editorElement, {
            placeholder: 'Escribe las instrucciones aquí...',
            toolbar: [
              'heading',
              '|',
              'bold',
              'italic',
              'bulletedList',
              'numberedList',
              'link',
              '|',
              'undo',
              'redo'
            ]
          })
          .then((editor: any) => {
            this.editorInstance = editor;
            editor.setData(this.nuevoSistema.instruccionesHTML || '');
            editor.model.document.on('change:data', () => {
              this.nuevoSistema.instruccionesHTML = editor.getData();
            });
          })
          .catch((err: any) => {
            console.error('Error al iniciar CKEditor:', err);
          });
      }
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.editorInstance) {
      this.editorInstance.destroy();
    }
  }

private scrollAlFormulario(): void {
  setTimeout(() => {
    const element = document.getElementById('formularioSistema');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    this.inputNombreRef?.nativeElement.focus(); // Si quieres enfocar
  }, 100);
}



seleccionarSistema(id: string): void {
  this.animar = false;
  this.sistemaSeleccionado = this.sistemas.find(s => s.id === id);

  if (this.sistemaSeleccionado) {
    this.contenidoSeguro = this.sanitizer.bypassSecurityTrustHtml(
      this.sistemaSeleccionado.instruccionesHTML
    );
    this.mostrarInstrucciones = true;

    setTimeout(() => {
      this.animar = true;

      const globoElement = this.globos.first?.nativeElement;
      if (globoElement) {
        globoElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center' // o 'start' si prefieres más arriba
        });
      }
    }, 50);
  }
}

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenTemporal = reader.result as string;
        this.nuevoSistema.imagen = this.imagenTemporal;
      };
      reader.readAsDataURL(archivo);
    }
  }

  guardarSistema(): void {
    const { nombre, instruccionesHTML, imagen } = this.nuevoSistema;
    if (!nombre || !instruccionesHTML || !imagen) return;

    const id = nombre.trim().toLowerCase().replace(/\s+/g, '-');

    if (this.editando && this.sistemaEditandoId) {
      const index = this.sistemas.findIndex(s => s.id === this.sistemaEditandoId);
      if (index !== -1) {
        this.sistemas[index] = { id, nombre, imagen, instruccionesHTML };
      }
    } else {
      const yaExiste = this.sistemas.some(s => s.id === id);
      if (yaExiste) {
        alert('Ya existe un sistema con ese nombre.');
        return;
      }

      this.sistemasService.agregarSistema({ id, nombre, imagen, instruccionesHTML });
    }

    this.sistemas = this.sistemasService.obtenerSistemas();
    this.cancelarEdicion();
  }

editarSistema(sistema: SistemaOperativo): void {
  this.nuevoSistema = { ...sistema };
  this.imagenTemporal = sistema.imagen || null;
  this.editando = true;
  this.sistemaEditandoId = sistema.id;

  setTimeout(() => {
    if (this.editorInstance) {
      this.editorInstance.setData(this.nuevoSistema.instruccionesHTML || '');
    }
    this.scrollAlFormulario(); // 👈 Scroll al formulario
  }, 0);
}


cancelarEdicion(): void {
  this.editando = false;
  this.sistemaEditandoId = null;
  this.imagenTemporal = null;
  this.nuevoSistema = {
    id: '',
    nombre: '',
    imagen: '',
    instruccionesHTML: ''
  };

  setTimeout(() => {
    if (this.editorInstance) {
      this.editorInstance.setData('');
    }
    this.scrollAlFormulario(); // 👈 Scroll al formulario
  }, 0);
}


  eliminarSistema(id: string): void {
    const confirmado = confirm('¿Estás seguro de eliminar este sistema?');
    if (!confirmado) return;

    this.sistemas = this.sistemas.filter(s => s.id !== id);

    if (this.sistemaSeleccionado?.id === id) {
      this.sistemaSeleccionado = undefined;
      this.contenidoSeguro = undefined;
      this.mostrarInstrucciones = false;
    }

    if (this.sistemaEditandoId === id) {
      this.cancelarEdicion();
    }
  }

  
}
