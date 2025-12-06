import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { OffboardingService, TerminationProcess, AssignedAsset } from './services/offboarding.service';
import { AssetsDialogComponent } from './components/assets-dialog/assets-dialog.component';

@Component({
  selector: 'app-ceses',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, AssetsDialogComponent],
  template: `
    <div class="p-6 max-w-[1600px] mx-auto h-[calc(100vh-64px)] flex flex-col">
       <!-- Header -->
       <div class="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm mb-6">
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
           Módulo Ceses
        </h1>
      </div>

      <!-- Main Content -->
      <div class="flex flex-1 gap-6 overflow-hidden">
        
        <!-- Left Panel: List & Filters -->
        <div class="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col min-w-0">
          
          <!-- Filters -->
          <div class="p-6 border-b border-gray-100 space-y-4">
             <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                 <label class="label text-xs font-bold text-gray-500 uppercase">Estado</label>
                 <select class="select select-bordered w-full" [(ngModel)]="filters.status" (ngModelChange)="applyFilters()">
                    <option value="">Todos</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Finalizado">Finalizado</option>
                 </select>
               </div>
               <div>
                 <label class="label text-xs font-bold text-gray-500 uppercase">Sede</label>
                 <select class="select select-bordered w-full" [(ngModel)]="filters.location" (ngModelChange)="applyFilters()">
                    <option value="">Todas</option>
                    <option value="San Borja">San Borja</option>
                    <option value="Miraflores">Miraflores</option>
                 </select>
               </div>
                <div>
                 <label class="label text-xs font-bold text-gray-500 uppercase">Empleado</label>
                 <input type="text" placeholder="Buscar..." class="input input-bordered w-full" [(ngModel)]="filters.query" (input)="applyFilters()" />
               </div>
             </div>
             
             <div class="grid grid-cols-2 gap-4">
                <div>
                   <label class="label text-xs font-bold text-gray-500 uppercase">Fecha Inicio</label>
                   <input type="date" class="input input-bordered w-full" />
                </div>
                 <div>
                   <label class="label text-xs font-bold text-gray-500 uppercase">Fecha Fin</label>
                   <input type="date" class="input input-bordered w-full" />
                </div>
             </div>
          </div>

          <!-- Table -->
          <div class="flex-1 overflow-auto">
             <table class="table table-pin-rows">
               <thead class="bg-gray-50 text-gray-600">
                 <tr>
                   <th>Fecha</th>
                   <th>Usuario</th>
                   <th>DNI</th>
                   <th>Cargo</th>
                   <th>Area</th>
                   <th>Estado</th>
                 </tr>
               </thead>
               <tbody>
                  @for (process of filteredProcesses(); track process.id) {
                    <tr 
                      class="hover:bg-blue-50 cursor-pointer transition-colors"
                      [class.bg-blue-100]="selectedProcess()?.id === process.id"
                      (click)="selectProcess(process)"
                    >
                      <td class="whitespace-nowrap font-mono text-gray-600">{{ process.registrationDate }}</td>
                      <td>
                        <div class="flex flex-col">
                           <span class="font-medium text-gray-900">{{ process.employeeEmail }}</span>
                        </div>
                      </td>
                      <td class="font-mono text-gray-500">{{ process.employeeDni }}</td>
                      <td>{{ process.employeePosition }}</td>
                      <td>{{ process.employeeArea }}</td>
                      <td>
                        <span 
                          class="badge font-medium" 
                          [ngClass]="{
                            'badge-warning text-yellow-700 bg-yellow-100 border-yellow-200': process.status === 'Pendiente',
                            'badge-ghost text-gray-600 bg-gray-200': process.status === 'En Proceso',
                            'badge-success text-green-700 bg-green-100 border-green-200': process.status === 'Finalizado'
                          }"
                        >
                          {{ process.status }}
                        </span>
                      </td>
                    </tr>
                  }
                  @if (filteredProcesses().length === 0) {
                     <tr>
                      <td colspan="6" class="text-center py-10 text-gray-400">No se encontraron registros</td>
                     </tr>
                  }
               </tbody>
             </table>
          </div>
        </div>

        <!-- Right Panel: Details -->
        @if (selectedProcess(); as p) {
           <div class="w-96 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-fit animate-in slide-in-from-right-4 fade-in">
              <div class="p-6 border-b border-gray-100">
                 <h2 class="text-xl font-bold text-gray-800 mb-1">{{ p.employeeName }}</h2>
                 <p class="text-sm text-gray-500">{{ p.employeePosition }}</p>
                 <div class="mt-4 text-sm space-y-1">
                    <p><span class="font-bold text-gray-700">DNI:</span> {{ p.employeeDni }}</p>
                    <p><span class="font-bold text-gray-700">Fecha de Renuncia:</span> {{ p.terminationDate }}</p>
                 </div>
              </div>

              <div class="p-6">
                 <h3 class="font-bold text-gray-800 mb-4 text-lg">Activos Asignados</h3>
                 
                 <!-- Embedded Asset List Summary -->
                  <div class="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mb-6">
                    <table class="table table-xs w-full">
                      <thead class="bg-gray-100 text-gray-600">
                        <tr>
                          <th>Tipo</th>
                          <th class="text-center">Cant.</th>
                          <th>Estado</th>
                          <th class="text-right">Accion</th>
                        </tr>
                      </thead>
                      <tbody>
                         @for (group of assetSummary(); track group.type + group.status) {
                           <tr class="hover:bg-gray-100">
                              <td>{{ group.type }}</td>
                              <td class="text-center">{{ group.count }}</td>
                              <td>
                                 <span class="text-xs font-semibold" [class.text-green-600]="group.status === 'Devuelto'" [class.text-orange-600]="group.status === 'Asignado'">
                                   {{ group.status }}
                                 </span>
                              </td>
                              <td class="text-right">
                                  <button class="btn btn-link btn-xs no-underline text-blue-600" (click)="openAssetsDialog()">Ver</button>
                              </td>
                           </tr>
                         }
                      </tbody>
                    </table>
                  </div>

                 <!-- Main Action Button -->
                 @if (p.status === 'Finalizado') {
                    <button class="btn btn-primary w-full text-white shadow-md">
                       Emitir Acta Devolucion
                    </button>
                 } @else {
                    <div class="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100">
                       El proceso se encuentra <strong>{{ p.status }}</strong>. Verifique la devolución de equipos.
                    </div>
                 }
              </div>
           </div>
        }
      </div>

       <!-- Assets Pop-up -->
       @if (showAssetsDialog()) {
         <app-assets-dialog 
            [assets]="selectedProcess()?.assets ?? []"
            (close)="closeAssetsDialog()"
            (returnAsset)="handleReturnAsset($event)"
         ></app-assets-dialog>
       }

    </div>
  `
})
export class CesesComponent {
  private offboardingService = inject(OffboardingService);

  filters = {
    status: '',
    location: '',
    query: ''
  };

  filteredProcesses = signal<TerminationProcess[]>([]);
  selectedProcess = signal<TerminationProcess | null>(null);
  
  showAssetsDialog = signal(false);

  constructor() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProcesses.set(this.offboardingService.searchProcesses(this.filters));
  }

  selectProcess(p: TerminationProcess) {
    this.selectedProcess.set(p);
  }

  openAssetsDialog() {
    this.showAssetsDialog.set(true);
  }

  closeAssetsDialog() {
    this.showAssetsDialog.set(false);
  }

  handleReturnAsset(asset: AssignedAsset) {
    if (this.selectedProcess()) {
       this.offboardingService.markAssetAsReturned(this.selectedProcess()!.id, asset.id);
       this.refreshSelection();
       this.applyFilters(); 
    }
  }

  refreshSelection() {
     if (this.selectedProcess()) {
        const id = this.selectedProcess()!.id;
        const fresh = this.offboardingService.searchProcesses({}).find(p => p.id === id);
        if (fresh) this.selectedProcess.set(fresh);
     }
  }

  getAssetSummaryStrict(assets: AssignedAsset[]) {
      const groups: { [key: string]: { type: string, count: number, status: string } } = {};
      
      assets.forEach(a => {
          const key = `${a.type}-${a.status}`;
          if (!groups[key]) {
              groups[key] = { type: a.type, count: 0, status: a.status };
          }
          groups[key].count++;
      });
      
      return Object.values(groups);
  }

  assetSummary = computed(() => {
     const p = this.selectedProcess();
     if(!p) return [];
     return this.getAssetSummaryStrict(p.assets);
  });
}
