import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ConfigurationService, AssetTypeConfig } from '../../services/configuration.service';

@Component({
  selector: 'app-asset-types-config',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="h-full flex flex-col animate-in fade-in slide-in-from-right-4">
       <!-- Header -->
       <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Bo</h2>
          <button class="btn btn-primary text-white shadow-lg gap-2" (click)="openDialog()">
             <lucide-icon name="plus" size="18"></lucide-icon>
             Nuevo Tipo
          </button>
       </div>

       <!-- Table -->
       <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full max-w-3xl">
          <table class="table w-full">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
               <tr>
                  <th class="w-16">ID</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th class="text-end">Acciones</th>
               </tr>
            </thead>
            <tbody>
               @for (type of types(); track type.id) {
                  <tr class="hover:bg-gray-50 border-b border-gray-100">
                     <td class="text-gray-400 font-mono text-sm">{{ type.id }}</td>
                     <td class="font-bold text-gray-800">{{ type.name }}</td>
                     <td class="text-gray-600 truncate">{{ type.description }}</td>
                     <td class="text-end">
                        <button class="btn btn-link btn-xs text-blue-600 no-underline">EDITAR</button>
                     </td>
                  </tr>
               }
            </tbody>
          </table>
       </div>

       <!-- Dialog -->
       @if (showDialog()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200">
                <div class="p-6">
                    <h3 class="font-bold text-lg text-gray-800 mb-4">Agregar Tipo de Activo</h3>
                    
                    <div class="space-y-4">
                        <div class="form-control">
                            <label class="label text-xs font-bold text-gray-500">Nombre</label>
                            <input type="text" [(ngModel)]="newItem.name" class="input input-bordered w-full" placeholder="Ej. Impresora" />
                        </div>
                        <div class="form-control">
                            <label class="label text-xs font-bold text-gray-500">Descripción</label>
                            <input type="text" [(ngModel)]="newItem.description" class="input input-bordered w-full" placeholder="Descripción breve" />
                        </div>
                    </div>

                    <div class="mt-6 flex gap-3 justify-end">
                        <button class="btn btn-primary text-white" (click)="save()">Guardar</button>
                        <button class="btn btn-error text-white" (click)="closeDialog()">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
       }
    </div>
  `
})
export class AssetTypesComponent {
  private configService = inject(ConfigurationService);
  types = this.configService.assetTypes;

  showDialog = signal(false);
  
  newItem: Omit<AssetTypeConfig, 'id'> = {
      name: '',
      description: ''
  };

  openDialog() {
      this.newItem = { name: '', description: '' };
      this.showDialog.set(true);
  }

  closeDialog() {
      this.showDialog.set(false);
  }

  save() {
      if (this.newItem.name) {
          this.configService.addAssetType(this.newItem);
          this.closeDialog();
      } else {
          alert('Nombre requerido.');
      }
  }
}
