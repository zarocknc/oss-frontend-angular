import { Component, signal } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  template: '<app-layout />',
  styles: ``,
})
export class App {
  protected readonly title = signal('oss-new');
}
