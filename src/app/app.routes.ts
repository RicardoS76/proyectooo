import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarLateralComponent } from './navbar-lateral/navbar-lateral.component';
import { PrincipalPage } from './modules/principal/principal.page';

// Importa los nuevos componentes Standalone
import { NotificacionesListComponent } from './modules/notificaciones/components/notificaciones-list/notificaciones-list.component';
import { NotificacionesAdminComponent } from './modules/notificaciones/components/notificaciones-admin/notificaciones-admin.component';
import { ErrorComponent } from './404/404.component';
import { ActivaDatosComponent } from './modules/activa-datos/activa-datos.component';
import { PaquetesTarifasComponent } from './modules/paquetes-tarifas/paquetes-tarifas.component';
import { PaquetesTarifasAdminComponent } from './modules/paquetes-tarifas/components/paquetes-tarifas-admin/paquetes-tarifas-admin.component';
import { PaquetesTarifasListComponent } from './modules/paquetes-tarifas/components/paquetes-tarifas-list/paquetes-tarifas-list.component';
import { TarifasGranelComponent } from './modules/tarifas-granel/tarifas-granel.component';
import { TarifasGranelAdminComponent } from './modules/tarifas-granel/components/tarifas-granel-admin/tarifas-granel-admin.component';
import { ConsideracionesComponent } from './modules/consideraciones/components/consideraciones/consideraciones.component';
import { ConsideracionesAdminComponent } from './modules/consideraciones/components/consideraciones-admin/consideraciones-admin.component';
import { SabiasQueComponent } from './modules/sabias-que/sabias-que.component';
import { PermisoAdminComponent } from './modules/permiso-admin/permiso-admin.component';
import { GerenciaAdminRiComponent } from './modules/gerencia-admin-ri/gerencia-admin-ri.component';
import { LinksAdminComponent } from './modules/admin/links-admin.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: NavbarLateralComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'principal', component: PrincipalPage },

      // 🔵 Nuevas rutas de Notificaciones
      { path: 'notificaciones', component: NotificacionesListComponent },
      { path: 'notificaciones/admin', component: NotificacionesAdminComponent },

      { path: 'activa-datos', component: ActivaDatosComponent },
      { path: 'paquetes-tarifas', component: PaquetesTarifasComponent },
      {
        path: 'paquetes-tarifas/admin',
        component: PaquetesTarifasAdminComponent
      },
      {
        path: 'paquetes-tarifas/:categoria',
        component: PaquetesTarifasListComponent
      },
      { path: 'tarifas-granel', component: TarifasGranelComponent },
      { path: 'tarifas-granel/admin', component: TarifasGranelAdminComponent },

      {
        path: 'consideraciones', component: ConsideracionesComponent },
      {
        path: 'admin/consideraciones', component: ConsideracionesAdminComponent },

        // 🆕 ¿Sabías que?
        { path: 'sabias-que', component: SabiasQueComponent }, // 👈 NUEVA RUTA AÑADIDA

  {
    path: 'gerencia-admin-ri',
    component: GerenciaAdminRiComponent
  },

   {
    path: 'admin/enlaces',
    component: LinksAdminComponent
  },
        {
          path: 'admin/permisos',
          component: PermisoAdminComponent,
          canActivate: [AuthGuard],
          data: { rol: 'superAdmin' }
        },

      { path: '404', component: ErrorComponent},

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '404' }
];
