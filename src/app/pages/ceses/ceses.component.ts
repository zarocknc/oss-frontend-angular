import { Component } from '@angular/core';
import { PageComponent } from '../page.component';

@Component({
  selector: 'app-ceses',
  standalone: true,
  imports: [PageComponent],
  template: `<app-page [title]="'Ceses'"></app-page>`,
})
export class CesesComponent {}
