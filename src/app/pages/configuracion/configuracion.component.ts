import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

import { UsersComponent } from './components/users/users.component';
import { LocationsComponent } from './components/locations/locations.component';
import { AssetTypesComponent } from './components/asset-types/asset-types.component';
import { GeneralParamsComponent } from './components/general-params/general-params.component';

type ConfigView = 'MENU' | 'USERS' | 'LOCATIONS' | 'TYPES' | 'GENERAL';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
      CommonModule, 
      LucideAngularModule,
      UsersComponent,
      LocationsComponent,
      AssetTypesComponent,
      GeneralParamsComponent
  ],
  template: `
    <div class="h-[calc(100vh-64px)] p-6 max-w-[1600px] mx-auto flex flex-col">
       
       <!-- Top Bar / Back Navigation -->
       @if (currentView() !== 'MENU') {
           <div class="mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
               <button class="btn btn-ghost btn-sm gap-2" (click)="navigate('MENU')">
                   <lucide-icon name="chevron-right" class="rotate-180" size="18"></lucide-icon>
                   Volver al Menú
               </button>
               <span class="text-gray-300">/</span>
               <span class="font-bold text-gray-600">{{ getTitle() }}</span>
           </div>
       }

       <!-- Main Content Area -->
       <div class="flex-1 overflow-hidden bg-gray-50/50 rounded-xl">
           @switch (currentView()) {
               @case ('MENU') {
                   <div class="h-full flex flex-col justify-center items-center animate-in zoom-in-95 duration-300">
                       <h1 class="text-3xl font-bold text-gray-800 mb-8">Configuración</h1>
                       
                       <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
                           <!-- Users -->
                           <button class="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-left group border border-gray-100" (click)="navigate('USERS')">
                               <div class="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <lucide-icon name="users" size="32"></lucide-icon>
                               </div>
                               <h3 class="text-xl font-bold text-gray-800 mb-2">Usuarios y Roles</h3>
                               <p class="text-gray-500 text-sm">Administre las cuentas de acceso y sus permisos.</p>
                           </button>

                           <!-- Locations -->
                           <button class="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-left group border border-gray-100" (click)="navigate('LOCATIONS')">
                               <div class="bg-teal-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                  <lucide-icon name="map-pin" size="32"></lucide-icon>
                               </div>
                               <h3 class="text-xl font-bold text-gray-800 mb-2">Sedes y Almacenes</h3>
                               <p class="text-gray-500 text-sm">Gestione las ubicaciones físicas y almacenes.</p>
                           </button>

                           <!-- Asset Types -->
                           <button class="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-left group border border-gray-100" (click)="navigate('TYPES')">
                               <div class="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                  <lucide-icon name="monitor" size="32"></lucide-icon>
                               </div>
                               <h3 class="text-xl font-bold text-gray-800 mb-2">Tipos de Activos</h3>
                               <p class="text-gray-500 text-sm">Categorice el hardware gestionado por el sistema.</p>
                           </button>

                           <!-- General -->
                           <button class="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-left group border border-gray-100" (click)="navigate('GENERAL')">
                               <div class="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-gray-600 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                                  <lucide-icon name="settings" size="32"></lucide-icon>
                               </div>
                               <h3 class="text-xl font-bold text-gray-800 mb-2">Parámetros Generales</h3>
                               <p class="text-gray-500 text-sm">Ajustes globales y variables del sistema.</p>
                           </button>
                       </div>
                   </div>
               }
               @case ('USERS') {
                   <app-users-config></app-users-config>
               }
               @case ('LOCATIONS') {
                   <app-locations-config></app-locations-config>
               }
               @case ('TYPES') {
                   <app-asset-types-config></app-asset-types-config>
               }
               @case ('GENERAL') {
                   <app-general-params-config></app-general-params-config>
               }
           }
       </div>
    </div>
  `
})
export class ConfiguracionComponent {
  currentView = signal<ConfigView>('MENU');

  navigate(view: ConfigView) {
      this.currentView.set(view);
  }

  getTitle() {
      switch(this.currentView()) {
          case 'USERS': return 'Configuración Usuario';
          case 'LOCATIONS': return 'Configuración Sedes';
          case 'TYPES': return 'Configuración Tipos de Activos';
          case 'GENERAL': return 'Parámetros Generales';
          default: return '';
      }
  }
}
