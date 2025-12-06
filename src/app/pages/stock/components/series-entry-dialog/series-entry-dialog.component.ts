import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { InventoryService, InventoryAsset, AssetStatus } from '../../../inventario/services/inventory.service';

interface SeriesEntry {
  series: string;
  invCode: string; // generated or manual
  status: AssetStatus;
  tempId: number; // for tracking rows
}

@Component({
  selector: 'app-series-entry-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="p-6 border-b border-gray-100 flex justify-between items-start bg-blue-50/50 rounded-t-lg">
            <div>
                <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                    Ingreso de Series - Guía <span class="text-blue-600">{{ guideNumber || 'Nueva' }}</span>
                </h2>
                <p class="text-sm text-gray-500 mt-1">Complete la información del lote y registre las series individuales.</p>
            </div>
          <button class="btn btn-sm btn-circle btn-ghost" (click)="onClose()">✕</button>
        </div>

        <!-- Body: Scrollable -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8">
             
             <!-- Batch Info -->
             <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div class="form-control">
                    <label class="label text-xs font-bold text-gray-500">Marca</label>
                    <input type="text" [(ngModel)]="brand" class="input input-sm input-bordered w-full bg-white" placeholder="Ej. Lenovo" />
                </div>
                 <div class="form-control">
                    <label class="label text-xs font-bold text-gray-500">Modelo</label>
                    <input type="text" [(ngModel)]="model" class="input input-sm input-bordered w-full bg-white" placeholder="Ej. T440" />
                </div>
                 <div class="form-control">
                    <label class="label text-xs font-bold text-gray-500">Almacén</label>
                    <select [(ngModel)]="location" class="select select-sm select-bordered w-full bg-white">
                        <option value="San Borja">San Borja</option>
                        <option value="Miraflores">Miraflores</option>
                        <option value="Almacén Central">Almacén Central</option>
                    </select>
                </div>
                 <div class="form-control">
                    <label class="label text-xs font-bold text-gray-500">Fecha de ingreso</label>
                    <input type="date" [(ngModel)]="date" class="input input-sm input-bordered w-full bg-white" />
                </div>
                 <div class="form-control">
                    <label class="label text-xs font-bold text-gray-500">N° de Guía - Doc.</label>
                    <input type="text" [(ngModel)]="guideNumber" class="input input-sm input-bordered w-full bg-white" placeholder="GR-XXXXX" />
                </div>
                 <div class="form-control">
                    <label class="label text-xs font-bold text-gray-500">Valor Unitario (S/.)</label>
                    <input type="number" [(ngModel)]="unitValue" class="input input-sm input-bordered w-full bg-white" placeholder="0.00" />
                </div>
             </div>

             <!-- Series Table -->
             <div>
                <h3 class="font-bold text-gray-800 mb-3 flex justify-between items-center">
                    Registro de Series
                    <span class="text-xs font-normal text-gray-500">{{ list.length }} equipos</span>
                </h3>
                
                <div class="overflow-x-auto border border-gray-200 rounded-lg">
                    <table class="table table-sm w-full">
                        <thead class="bg-gray-100 text-gray-600">
                            <tr>
                                <th class="w-12 text-center">#</th>
                                <th>Serie del equipo</th>
                                <th>Código de inventario</th>
                                <th>Estado inicial</th>
                                <th class="w-10 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            @for (item of list; track item.tempId; let i = $index) {
                                <tr class="hover:bg-gray-50">
                                    <td class="text-center font-mono text-gray-400">{{ i + 1 }}</td>
                                    <td>
                                        <input type="text" [(ngModel)]="item.series" placeholder="SN..." class="input input-xs input-bordered w-full font-mono" />
                                    </td>
                                    <td>
                                        <input type="text" [(ngModel)]="item.invCode" placeholder="INV-..." class="input input-xs input-bordered w-full font-mono" />
                                    </td>
                                    <td>
                                       <div class="flex items-center gap-2 text-sm">
                                            <lucide-icon name="check-circle" class="w-4 h-4 text-teal-600" size="16"></lucide-icon>
                                            <span class="text-teal-700 font-medium">Disponible</span>
                                       </div>
                                    </td>
                                    <td class="text-center">
                                        <button class="btn btn-ghost btn-xs text-red-400 hover:text-red-600" (click)="removeRow(i)">
                                            <lucide-icon name="trash-2" size="16"></lucide-icon>
                                        </button>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

                <div class="flex justify-between mt-4">
                     <button class="btn btn-outline btn-sm btn-primary gap-2" (click)="addRow()">
                        <lucide-icon name="plus" size="16"></lucide-icon>
                        Agregar fila
                    </button>
                    
                     <button class="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white gap-2 shadow-sm" (click)="importExcel()">
                        <lucide-icon name="file-spreadsheet" size="16"></lucide-icon>
                        Importar desde Excel (.xlsx)
                    </button>
                </div>
             </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end rounded-b-lg">
           <button class="btn btn-primary text-white shadow-md gap-2" (click)="onSave()">
                Guardar series ingresadas
           </button>
           <button class="btn btn-error text-white shadow-md" (click)="onClose()">Cancelar</button>
        </div>
      </div>
    </div>
  `
})
export class SeriesEntryDialogComponent {
  private inventoryService = inject(InventoryService);
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<InventoryAsset[]>();

  // Form Data
  brand = 'Lenovo';
  model = 'T440';
  location = 'San Borja';
  date = new Date().toISOString().split('T')[0];
  guideNumber = '';
  unitValue = 1500.00;

  // List
  list: SeriesEntry[] = [
      { tempId: 1, series: '', invCode: '', status: 'Disponible' },
      { tempId: 2, series: '', invCode: '', status: 'Disponible' },
      { tempId: 3, series: '', invCode: '', status: 'Disponible' }
  ];

  onClose() {
    this.close.emit();
  }

  addRow() {
      this.list.push({ tempId: Date.now(), series: '', invCode: '', status: 'Disponible' });
  }

  removeRow(index: number) {
      this.list.splice(index, 1);
  }

  importExcel() {
      alert('Funcionalidad de Importar Excel simulada.\nSe cargarían filas desde el archivo.');
  }

  onSave() {
      // Validate
      if (!this.brand || !this.model || this.list.length === 0) {
          alert('Complete los datos del lote y agregue al menos una serie.');
          return;
      }

      // Convert Items to Assets
      const nextIdStart = parseInt(this.inventoryService.getNextId());
      
      const newAssets: InventoryAsset[] = this.list.map((item, index) => ({
          id: (nextIdStart + index).toString(),
          alm: this.location.toUpperCase(),
          type: 'Equipo', // Generic fallback, maybe infer from model? Let's treat as 'Laptop' for demo or just 'Equipo'
          brand: this.brand.toUpperCase(),
          model: this.model,
          series: item.series || 'SN-UNKNOWN',
          invCode: item.invCode || `INV-${Math.floor(Math.random()*10000)}`,
          cmdbCode: 'NUEVO',
          status: 'Disponible',
          observation: `Ingreso Guía ${this.guideNumber}`,
          currentLocation: this.location,
          bookValue: `S/. ${this.unitValue}`,
          age: 'Nuevo',
          processor: 'N/A', // Defaults
          ram: 'N/A'
      }));

      this.save.emit(newAssets);
  }
}
