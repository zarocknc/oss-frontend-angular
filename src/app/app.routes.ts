import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import {
  CesesComponent,
  ConfiguracionComponent,
  EmpleadosComponent,
  InicioComponent,
  InventarioComponent,
  ReportesComponent,
  StockComponent,
} from './pages';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        component: InicioComponent,
        data: { title: 'Inicio' },
      },
      {
        path: 'asignaciones',
        loadChildren: () => import('./pages/asignaciones/asignaciones.routes').then(m => m.ASIGNACIONES_ROUTES)
      },
      {
        path: 'reemplazos',
        loadChildren: () => import('./pages/reemplazos/reemplazos.routes').then(m => m.REPLACEMENT_ROUTES),
        data: { title: 'Reemplazos' },
      },
      {
        path: 'empleados',
        component: EmpleadosComponent,
        data: { title: 'Empleados' },
      },
      { path: 'ceses', component: CesesComponent, data: { title: 'Ceses' } },
      {
        path: 'inventario',
        component: InventarioComponent,
        data: { title: 'Inventario' },
      },
      { path: 'stock', component: StockComponent, data: { title: 'Stock' } },
      {
        path: 'reportes',
        component: ReportesComponent,
        data: { title: 'Reportes' },
      },
      {
        path: 'configuracion',
        component: ConfiguracionComponent,
        data: { title: 'Configuración' },
      },
    ]
  }
];
