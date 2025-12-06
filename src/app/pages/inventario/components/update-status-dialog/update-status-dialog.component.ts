import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { InventoryAsset, AssetStatus } from '../../services/inventory.service';

@Component({
  selector: 'app-update-status-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
                <h2 class="text-xl font-bold text-gray-800">Actualizar Estado del Activo</h2>
                <div class="text-xs text-gray-400 mt-1">ID: {{ asset.id }} | Modelo: {{ asset.model }}</div>
            </div>
          <button class="btn btn-sm btn-circle btn-ghost" (click)="onClose()">✕</button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4">
             <div>
                <label class="label text-sm font-bold text-gray-700">N° de serie</label>
                <input type="text" [value]="asset.series" readonly class="input input-bordered w-full bg-gray-50 text-gray-600" />
            </div>

            <div>
                 <label class="label text-sm font-bold text-gray-700">Nuevo estado</label>
                 <select class="select select-bordered w-full" [(ngModel)]="newStatus">
                    <option value="Disponible">Disponible</option>
                    <option value="Asignado">Asignado</option>
                    <option value="En mantenimiento">En mantenimiento</option>
                    <option value="Baja">Baja</option>
                 </select>
            </div>

             <div>
                 <label class="label text-sm font-bold text-gray-700">Observación</label>
                 <textarea 
                    class="textarea textarea-bordered w-full h-24" 
                    placeholder="Escriba observacion aqui..."
                    [(ngModel)]="observation"
                 ></textarea>
            </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end rounded-b-lg">
           <button class="btn btn-primary text-white" (click)="onSave()">Actualizar Estado</button>
           <button class="btn btn-error text-white" (click)="onClose()">Cancelar</button>
        </div>
      </div>
    </div>
  `
})
export class UpdateStatusDialogComponent {
  @Input({ required: true }) asset!: InventoryAsset;
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<{ status: AssetStatus, observation: string }>();

  newStatus: AssetStatus = 'Disponible';
  observation = '';

  ngOnInit() {
    // Initialize with current values
    if (this.asset) {
        this.newStatus = this.asset.status;
        this.observation = ''; // Typically blank for new log, or prefill if editing last log? Requirement implies "add observation". Let's keep blank.
    }
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    this.update.emit({ status: this.newStatus, observation: this.observation });
  }
}
