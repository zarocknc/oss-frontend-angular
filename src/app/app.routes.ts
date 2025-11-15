import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio.component';
import { AsignacionesComponent } from './pages/asignaciones.component';
import { ReemplazosComponent } from './reemplazos/reemplazos.component';
import { EmpleadosComponent } from './pages/empleados.component';
import { CesesComponent } from './pages/ceses.component';
import { InventarioComponent } from './pages/inventario.component';
import { StockComponent } from './pages/stock.component';
import { ReportesComponent } from './pages/reportes.component';
import { ConfiguracionComponent } from './pages/configuracion.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    component: InicioComponent,
    data: { title: 'Inicio' },
  },
  {
    path: 'asignaciones',
    component: AsignacionesComponent,
    data: { title: 'Asignaciones' },
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
