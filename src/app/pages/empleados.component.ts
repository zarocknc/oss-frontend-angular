import { Component } from '@angular/core';
import { PageComponent } from './page.component';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [PageComponent],
  template: `<app-page [title]="'Empleados'"></app-page>`,
})
export class EmpleadosComponent {}
