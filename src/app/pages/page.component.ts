import { Component } from '@angular/core';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [],
  template: `<h1>{{ title }}</h1>`,
})
export class PageComponent {
  title = 'Page';
}
