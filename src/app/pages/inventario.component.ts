import { Component } from '@angular/core';
import { PageComponent } from './page.component';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [PageComponent],
  template: `<app-page [title]="'Inventario'"></app-page>`,
})
export class InventarioComponent {}
