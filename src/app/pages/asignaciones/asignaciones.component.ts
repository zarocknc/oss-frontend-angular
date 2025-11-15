import { Component } from '@angular/core';
import { PageComponent } from '../page.component';

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [PageComponent],
  template: `<app-page [title]="'Asignaciones'"></app-page>`,
})
export class AsignacionesComponent {}
