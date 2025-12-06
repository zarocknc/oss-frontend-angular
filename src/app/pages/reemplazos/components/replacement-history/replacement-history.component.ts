import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReplacementService, ReplacementRecord } from '../../services/replacement.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-replacement-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <!-- Header -->
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Historial de Reemplazos</h1>
        <a routerLink="/reemplazos" class="btn btn-outline btn-sm btn-primary">
           Volver
        </a>
      </div>

      <!-- Filters -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 border-b border-gray-100">
         <div class="form-control">
          <label class="label text-xs font-bold text-gray-500 uppercase">Fecha</label>
          <input type="date" class="input input-bordered bg-white w-full max-w-xs" />
        </div>
        <div class="form-control">
          <label class="label text-xs font-bold text-gray-500 uppercase">Ticket</label>
          <input type="text" placeholder="Buscar por ticket..." class="input input-bordered bg-white w-full" />
        </div>
        <div class="form-control">
           <label class="label text-xs font-bold text-gray-500 uppercase">Colaborador</label>
          <input type="text" placeholder="Nombre del colaborador..." class="input input-bordered bg-white w-full" />
        </div>
      </div>

      <!-- Table -->
      <div class="flex-1 overflow-auto p-0">
        <table class="table table-zebra w-full text-sm">
          <thead class="sticky top-0 bg-white z-10 shadow-sm">
            <tr class="text-gray-600">
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Ticket</th>
              <th>Equipo (Anterior)</th>
              <th>Equipo (Actual)</th>
              <th>Informe</th>
            </tr>
          </thead>
          <tbody>
            @for (item of history(); track item.id) {
              <tr class="hover">
                <td class="whitespace-nowrap">{{ item.date }}</td>
                <td>
                  <div class="flex flex-col">
                    <span class="font-medium text-gray-900">{{ item.employee.name }}</span>
                    <span class="text-xs text-gray-500">{{ item.employee.email }}</span>
                  </div>
                </td>
                <td class="font-mono text-gray-600">{{ item.ticket }}</td>
                <td>
                  <div class="flex flex-col">
                    <span class="font-medium">{{ item.originalAsset.type }} {{ item.originalAsset.model }}</span>
                    <span class="text-xs text-gray-500">{{ item.originalAsset.series }}</span>
                  </div>
                </td>
                <td>
                   <div class="flex flex-col">
                    <span class="font-medium text-primary">{{ item.newAsset.type }} {{ item.newAsset.model }}</span>
                    <span class="text-xs text-gray-500">{{ item.newAsset.series }}</span>
                  </div>
                </td>
                <td>
                  <a [href]="item.reportUrl" class="btn btn-link btn-xs text-blue-600 no-underline hover:underline">ver informe</a>
                </td>
              </tr>
            }
            @if (history().length === 0) {
              <tr>
                <td colspan="6" class="text-center py-8 text-gray-500">
                  No se encontraron registros.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
       <div class="p-2 border-t border-gray-100 bg-gray-50 text-xs text-center text-gray-400">
        Mostrando {{ history().length }} registros
      </div>
    </div>
  `
})
export class ReplacementHistoryComponent {
  private replacementService = inject(ReplacementService);
  
  history = this.replacementService.replacements;
}
