import { Component } from '@angular/core';
import { PageComponent } from '../page.component';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [PageComponent],
  template: `<app-page [title]="'Stock'"></app-page>`,
})
export class StockComponent {}
