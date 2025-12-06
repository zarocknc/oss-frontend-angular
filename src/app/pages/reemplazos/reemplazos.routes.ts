import { Routes } from '@angular/router';
import { ReplacementComponent } from './reemplazos.component';
import { ReplacementHistoryComponent } from './components/replacement-history/replacement-history.component';

export const REPLACEMENT_ROUTES: Routes = [
  { path: '', component: ReplacementComponent },
  { path: 'historial', component: ReplacementHistoryComponent }
];
