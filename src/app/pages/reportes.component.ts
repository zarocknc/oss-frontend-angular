import { Component } from '@angular/core';
import { PageComponent } from './page.component';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [PageComponent],
  template: `<app-page [title]="'Reportes'"></app-page>`,
})
export class ReportesComponent {}
