import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [],
  template: `<h1>{{ title() }}</h1>`,
})
export class PageComponent {
  title = input('Page');
}
