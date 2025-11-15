import { Routes } from '@angular/router';
import { ReemplazosComponent } from './reemplazos';
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
    component: ReemplazosComponent,
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
];
