import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  LucideAngularModule,
  Home,
  ClipboardList,
  Repeat,
  Users,
  UserMinus,
  Archive,
  Package,
  FileText,
  Settings,
  Search,
  UserSearch,
  Save,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(
      LucideAngularModule.pick({
        Home,
        ClipboardList,
        Repeat,
        Users,
        UserMinus,
        Archive,
        Package,
        FileText,
        Settings,
        Search,
        UserSearch,
        Save,
      })
    ),
  ],
};
