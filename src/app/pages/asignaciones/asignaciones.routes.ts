import { Routes } from '@angular/router';
import { AsignacionesComponent } from './asignaciones.component';

export const ASIGNACIONES_ROUTES: Routes = [
  {
    path: '', // La ruta raíz (ej: /asignaciones) cargará este componente
    component: AsignacionesComponent,
    data: { title: 'Asignaciones' },
  }
  // Aquí podrías agregar rutas hijas como 'historial'
];
