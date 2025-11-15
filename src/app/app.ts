import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { LayoutComponent } from './layout/layout.component';
import { TitleService } from './services/title.service';

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  template: '<app-layout />',
  styles: ``,
})
export class App {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(TitleService);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        map((route) => route.snapshot.data['title'])
      )
      .subscribe((title: string) => {
        this.titleService.title.set(title);
      });
  }
}
