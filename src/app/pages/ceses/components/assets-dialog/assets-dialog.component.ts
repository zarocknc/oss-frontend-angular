import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignedAsset } from '../../services/offboarding.service';
import { LucideAngularModule, RotateCcw } from 'lucide-angular';

@Component({
  selector: 'app-assets-dialog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">Activos asignados</h2>
          <button class="btn btn-sm btn-circle btn-ghost" (click)="onClose()">✕</button>
        </div>

        <div class="p-0 overflow-auto max-h-[60vh]">
          <table class="table w-full">
            <thead class="bg-gray-50 text-gray-600 sticky top-0">
              <tr>
                <th>Equipo</th>
                <th>Modelo</th>
                <th>Serie</th>
                <th>Estado Actual</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              @for (asset of assets; track asset.id) {
                <tr class="hover">
                  <td class="font-bold">{{ asset.type }}</td>
                  <td>{{ asset.model }}</td>
                  <td class="font-mono text-xs">{{ asset.series }}</td>
                  <td>
                    <span 
                        class="badge badge-sm"
                        [ngClass]="{
                            'badge-success': asset.status === 'Devuelto',
                            'badge-warning': asset.status === 'Asignado'
                        }"
                    >
                        {{ asset.status }}
                    </span>
                  </td>
                  <td>
                    @if (asset.status === 'Asignado') {
                         <label class="cursor-pointer label justify-start gap-2 p-0">
                           <input type="checkbox" class="checkbox checkbox-xs checkbox-primary" (change)="onReturn(asset)" />
                           <span class="text-xs">Marcar devolución</span>
                         </label>
                    } @else {
                        <span class="text-xs text-green-600 font-medium flex items-center gap-1">
                             <input type="checkbox" checked disabled class="checkbox checkbox-xs checkbox-success" />
                             Devuelto
                        </span>
                    }
                   
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="p-4 bg-gray-50 border-t border-gray-100 flex justify-start rounded-b-lg">
           <button class="btn btn-primary text-white" (click)="onClose()">Volver</button>
        </div>
      </div>
    </div>
  `
})
export class AssetsDialogComponent {
  @Input({ required: true }) assets: AssignedAsset[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() returnAsset = new EventEmitter<AssignedAsset>();

  onClose() {
    this.close.emit();
  }

  onReturn(asset: AssignedAsset) {
    this.returnAsset.emit(asset);
  }
}
