import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-general-params-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col max-w-2xl animate-in fade-in slide-in-from-right-4">
       <!-- Header -->
       <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-800">Parámetros Generales</h2>
          <p class="text-gray-500">Ajuste las variables globales del sistema.</p>
       </div>

       <!-- Form -->
       <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
            <div class="form-control">
                <label class="label font-bold text-gray-700">Nombre del Sistema</label>
                <input type="text" [(ngModel)]="params.systemName" class="input input-bordered w-full bg-gray-50" />
                <div class="label">
                  <span class="label-text-alt text-gray-400">Texto mostrado en reportes y cabeceras</span>
                </div>
            </div>

            <div class="form-control">
                <label class="label font-bold text-gray-700">Razon Social</label>
                <input type="text" [(ngModel)]="params.companyName" class="input input-bordered w-full bg-gray-50" />
                <div class="label">
                  <span class="label-text-alt text-gray-400">Entidad legal para emisión de documentos</span>
                </div>
            </div>

            <div class="flex justify-start pt-4">
                <button class="btn btn-primary text-white w-32 shadow-lg" (click)="save()">
                   Guardar
                </button>
            </div>
       </div>
    </div>
  `
})
export class GeneralParamsComponent {
  private configService = inject(ConfigurationService);
  
  // Clone current value to avoid direct mutation before save
  params = { ...this.configService.generalParams() };

  save() {
    this.configService.updateGeneralParams(this.params);
    alert('Configuración guardada correctamente.');
  }
}
