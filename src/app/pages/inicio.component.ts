import { Component } from '@angular/core';
import { PageComponent } from './page.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [PageComponent],
  template: `<app-page [title]="'Inicio'"></app-page>`,
})
export class InicioComponent {}
