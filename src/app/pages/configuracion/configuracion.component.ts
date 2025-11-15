import { Component } from '@angular/core';
import { PageComponent } from '../page.component';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [PageComponent],
  template: `<app-page [title]="'Configuracion'"></app-page>`,
})
export class ConfiguracionComponent {}
