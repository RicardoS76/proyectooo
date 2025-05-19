import { Injectable } from '@angular/core';
import { SistemaOperativo } from '../models/sistema-operativo.model';

@Injectable({ providedIn: 'root' })
export class SistemasOperativosService {
  private sistemas: SistemaOperativo[] = [
    {
      id: 'android',
      nombre: 'Android',
      imagen: 'assets/sd-web/images/android2.png', // imagen para tarjeta e instrucciones
      instruccionesHTML: `
        <p>
          Seleccionar <strong>Ajustes</strong> &gt;&gt; <strong>Apagar Wi-Fi</strong> &gt;&gt; <strong>Internet y redes</strong> &gt;&gt;
          <strong>Redes móviles</strong> &gt;&gt; <strong>Apagar Roaming de datos y datos</strong>.<br>
          Es muy importante si su equipo cuenta con <strong>Llamadas VoLTE</strong> tenerlo <strong>ENCENDIDO</strong>.<br>
          Luego ir a <strong>Modo o tipo de red</strong> y configurarlo en <strong>4G</strong>.<br>
          Ingresar a <strong>Operadores de red</strong> &gt;&gt; <strong>Apagar automático</strong> &gt;&gt; Seleccionar operador <strong>CLARO</strong>.<br>
          Regresar a <strong>Redes móviles</strong> y <strong>Activar datos y Roaming de datos</strong>.<br>
          Finalmente, <strong>Apagar y encender el equipo</strong>.
        </p>
      `
    },
    {
      id: 'ios',
      nombre: 'iOS',
      imagen: 'assets/sd-web/images/ios.png',
      instruccionesHTML: `
        <p>
          Seleccionar <strong>Configuración</strong> &gt;&gt; <strong>Red Celular</strong> &gt;&gt; <strong>Llamadas por WiFi</strong>
          (debe estar <strong>Deshabilitada</strong>).<br>
          Luego, en <strong>Red Celular &gt; Opciones</strong>:<br>
          Validar que <strong>Roaming de datos</strong> esté <strong>Activo</strong> y <strong>Modo de Datos</strong> esté en <strong>Estándar</strong>.<br><br>
          En la sección <strong>Voz y Datos</strong>, seleccionar <strong>4G VoLTE NO / Apagado</strong>.<br>
          Volver a <strong>Configuración</strong> &gt;&gt; ir a <strong>Selección de red</strong> &gt;&gt; Desactivar <strong>Modo automático</strong>
          y seleccionar un operador manualmente.<br>
          Validar que tenga señal y conexión.
        </p>
      `
    },
    {
      id: 'harmony',
      nombre: 'HarmonyOS',
      imagen: 'assets/sd-web/images/huawei.png',
      instruccionesHTML: `
        <p>
          Ir a <strong>Ajustes</strong> &gt;&gt; <strong>Redes móviles</strong> &gt;&gt; Asegurarse que <strong>Roaming de datos</strong> esté activado.<br>
          Luego seleccionar <strong>Modo de red</strong>: elegir <strong>4G/5G</strong> según disponibilidad.<br>
          Ingresar a <strong>Operadores de red</strong> &gt;&gt; Desactivar <strong>Selección automática</strong> &gt;&gt;
          seleccionar operador manualmente.<br>
          Validar que el dispositivo tenga señal y reiniciar si es necesario para aplicar los cambios.
        </p>
      `
    }
  ];

  obtenerSistemas(): SistemaOperativo[] {
    return this.sistemas;
  }

  agregarSistema(sistema: SistemaOperativo): void {
    this.sistemas.push(sistema);
  }
}
