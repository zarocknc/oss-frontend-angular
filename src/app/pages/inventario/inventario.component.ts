import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { InventoryService, InventoryAsset, AssetStatus } from './services/inventory.service';
import { UpdateStatusDialogComponent } from './components/update-status-dialog/update-status-dialog.component';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, UpdateStatusDialogComponent],
  template: `
    <div class="p-6 max-w-[1600px] mx-auto h-[calc(100vh-64px)] flex flex-col space-y-6">
      
       <!-- Header & KPIs -->
       <div>
          <h1 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            Inventario
          </h1>
          
          <div class="grid grid-cols-4 gap-4">
             <!-- KPI: Disponibles (Teal) -->
             <div class="bg-teal-600 text-white p-4 rounded-xl shadow-md flex flex-col justify-center h-24">
                <div class="text-3xl font-bold">{{ stats().available }}</div>
                <div class="text-sm font-medium opacity-90">Disponibles</div>
             </div>
              <!-- KPI: Asignados (Blue) -->
             <div class="bg-blue-600 text-white p-4 rounded-xl shadow-md flex flex-col justify-center h-24">
                <div class="text-3xl font-bold">{{ stats().assigned }}</div>
                <div class="text-sm font-medium opacity-90">Asignados</div>
             </div>
              <!-- KPI: En Mantenimiento (Orange) -->
             <div class="bg-orange-500 text-white p-4 rounded-xl shadow-md flex flex-col justify-center h-24">
                <div class="text-3xl font-bold">{{ stats().maintenance }}</div>
                <div class="text-sm font-medium opacity-90">En mantenimiento</div>
             </div>
              <!-- KPI: Baja (Red) -->
             <div class="bg-red-700 text-white p-4 rounded-xl shadow-md flex flex-col justify-center h-24">
                <div class="text-3xl font-bold">{{ stats().discharged }}</div>
                <div class="text-sm font-medium opacity-90">Baja</div>
             </div>
          </div>
       </div>

      <!-- Main Content Split View -->
      <div class="flex flex-1 gap-6 overflow-hidden">
        
        <!-- Left Panel: Table -->
        <div class="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col min-w-0">
           <!-- Table Container -->
          <div class="flex-1 overflow-auto">
             <table class="table table-pin-rows table-xs md:table-sm">
               <thead class="bg-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider">
                 <tr>
                   <th>ID</th>
                   <th>Almacen</th>
                   <th>Equipo</th>
                   <th>Marca</th>
                   <th>Modelo</th>
                   <th>Serie</th>
                   <th>INV</th>
                   <th>CMDB</th>
                   <th>Estado</th>
                   <th>Observacion</th>
                 </tr>
               </thead>
               <tbody class="text-xs">
                  @for (asset of assets(); track asset.id) {
                    <tr 
                      class="hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50"
                      [class.bg-blue-100]="selectedAsset()?.id === asset.id"
                      (click)="selectAsset(asset)"
                    >
                      <td class="font-mono text-gray-400">{{ asset.id }}</td>
                      <td class="font-medium text-gray-600">{{ asset.alm }}</td>
                      <td>{{ asset.type }}</td>
                      <td>{{ asset.brand }}</td>
                      <td>{{ asset.model }}</td>
                      <td class="font-mono">{{ asset.series }}</td>
                      <td class="font-mono text-gray-500">{{ asset.invCode }}</td>
                      <td class="font-mono text-gray-500">{{ asset.cmdbCode }}</td>
                      <td>
                         <span 
                          class="badge badge-sm font-bold border-0" 
                          [ngClass]="{
                            'bg-teal-100 text-teal-700': asset.status === 'Disponible',
                            'bg-blue-100 text-blue-700': asset.status === 'Asignado',
                            'bg-orange-100 text-orange-700': asset.status === 'En mantenimiento',
                            'bg-red-100 text-red-700': asset.status === 'Baja'
                          }"
                        >
                          {{ asset.status.toUpperCase() }}
                        </span>
                      </td>
                      <td class="text-gray-400 max-w-[150px] truncate" title="{{ asset.observation }}">{{ asset.observation }}</td>
                    </tr>
                  }
               </tbody>
             </table>
          </div>
          
          <!-- Pagination Footer (Mock) -->
          <div class="p-2 border-t border-gray-100 flex justify-center text-xs text-gray-500">
             1 2 3 4 5 ...... 17
          </div>
        </div>

        <!-- Right Panel: Details -->
        @if (selectedAsset(); as a) {
           <div class="w-80 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-fit animate-in slide-in-from-right-4 fade-in">
              <div class="p-6 border-b border-gray-100 bg-gray-50">
                 <h2 class="text-lg font-bold text-gray-800 leading-tight">{{ a.type }}</h2>
                 <p class="text-md text-gray-600 font-medium">{{ a.brand }} {{ a.model }}</p>
              </div>

              <div class="p-6 space-y-3 text-sm">
                 <div class="grid grid-cols-2 gap-2">
                    <span class="text-gray-500 font-medium">Procesador:</span>
                    <span class="text-right text-gray-700">{{ a.processor }}</span>
                    
                    <span class="text-gray-500 font-medium">Ram:</span>
                    <span class="text-right text-gray-700">{{ a.ram }}</span>
                    
                    <span class="text-gray-500 font-medium">Antiguedad:</span>
                    <span class="text-right text-gray-700">{{ a.age }}</span>
                    
                    <span class="text-gray-500 font-medium">Estado actual:</span>
                    <span class="text-right font-bold truncate" [ngClass]="{
                            'text-teal-600': a.status === 'Disponible',
                            'text-blue-600': a.status === 'Asignado',
                            'text-orange-500': a.status === 'En mantenimiento',
                            'text-red-600': a.status === 'Baja'
                    }">{{ a.status }}</span>
                    
                    <span class="text-gray-500 font-medium">Ubicacion:</span>
                    <span class="text-right text-gray-700">{{ a.currentLocation }}</span>
                    
                    <span class="text-gray-500 font-medium">Valor Contable:</span>
                    <span class="text-right text-gray-700">{{ a.bookValue }}</span>
                 </div>
                 
                 <div class="divider my-2"></div>
                 
                 <button class="btn btn-primary w-full text-white shadow-md" (click)="openUpdateDialog()">
                    Actualizar Estado
                 </button>
              </div>
           </div>
        }
      </div>

      <!-- Update Dialog -->
       @if (showUpdateDialog()) {
         <app-update-status-dialog 
            [asset]="selectedAsset()!"
            (close)="closeUpdateDialog()"
            (update)="handleUpdateStatus($event)"
         ></app-update-status-dialog>
       }
    </div>
  `
})
export class InventarioComponent {
  private inventoryService = inject(InventoryService);

  assets = this.inventoryService.assets;
  stats = this.inventoryService.stats;

  selectedAsset = signal<InventoryAsset | null>(null);
  showUpdateDialog = signal(false);

  selectAsset(asset: InventoryAsset) {
    this.selectedAsset.set(asset);
  }

  openUpdateDialog() {
    this.showUpdateDialog.set(true);
  }

  closeUpdateDialog() {
    this.showUpdateDialog.set(false);
  }

  handleUpdateStatus(event: { status: AssetStatus, observation: string }) {
    if (this.selectedAsset()) {
        this.inventoryService.updateAssetStatus(this.selectedAsset()!.id, event.status, event.observation);
        this.showUpdateDialog.set(false);
        
        // Refresh selected asset reference with updated one
        const updated = this.assets().find(a => a.id === this.selectedAsset()?.id);
        if (updated) this.selectedAsset.set(updated);
    }
  }
}
