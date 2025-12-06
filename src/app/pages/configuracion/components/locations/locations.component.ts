import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ConfigurationService, LocationConfig } from '../../services/configuration.service';

@Component({
  selector: 'app-locations-config',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="h-full flex flex-col animate-in fade-in slide-in-from-right-4">
       <!-- Header -->
       <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Bo</h2>
          <button class="btn btn-primary text-white shadow-lg gap-2" (click)="openDialog()">
             <lucide-icon name="plus" size="18"></lucide-icon>
             Nueva Sede
          </button>
       </div>

       <!-- Table -->
       <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table class="table w-full">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
               <tr>
                  <th>ID</th>
                  <th>Sede</th>
                  <th>Almacén</th>
                  <th>Dirección</th>
                  <th>Tipo</th>
                  <th class="text-end">Acciones</th>
               </tr>
            </thead>
            <tbody>
               @for (loc of locations(); track loc.id) {
                  <tr class="hover:bg-gray-50 border-b border-gray-100">
                     <td class="text-gray-400 font-mono text-sm">{{ loc.id }}</td>
                     <td class="font-medium text-gray-800">{{ loc.name }}</td>
                     <td class="text-gray-600">{{ loc.warehouseName }}</td>
                     <td class="text-gray-500 text-sm max-w-[200px] truncate">{{ loc.address }}</td>
                     <td>
                        <span class="badge badge-sm font-bold" [class.badge-primary]="loc.type === 'Central'" [class.badge-ghost]="loc.type !== 'Central'">
                            {{ loc.type }}
                        </span>
                     </td>
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
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col animate-in zoom-in-95 duration-200">
                <div class="p-4 border-b border-gray-100 bg-blue-600 text-white rounded-t-lg">
                    <h3 class="font-bold text-lg">Registrar Nueva Sede o Almacén</h3>
                </div>
                
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-control">
                        <label class="label text-xs font-bold text-gray-500">Nombre de la Sede</label>
                        <input type="text" [(ngModel)]="newLoc.name" class="input input-bordered w-full" placeholder="Ej. SAN ISIDRO" />
                    </div>
                     <div class="form-control">
                        <label class="label text-xs font-bold text-gray-500">Nombre del Almacén</label>
                        <input type="text" [(ngModel)]="newLoc.warehouseName" class="input input-bordered w-full" placeholder="Ej. ALM. PISO 7" />
                    </div>
                     <div class="form-control">
                        <label class="label text-xs font-bold text-gray-500">Dirección</label>
                        <input type="text" [(ngModel)]="newLoc.address" class="input input-bordered w-full" />
                    </div>
                     <div class="form-control">
                        <label class="label text-xs font-bold text-gray-500">Teléfono / Anexo</label>
                        <input type="text" [(ngModel)]="newLoc.phone" class="input input-bordered w-full" />
                    </div>
                     <div class="form-control">
                        <label class="label text-xs font-bold text-gray-500">Responsable</label>
                        <input type="text" [(ngModel)]="newLoc.responsible" class="input input-bordered w-full" />
                    </div>
                     <div class="form-control">
                        <label class="label text-xs font-bold text-gray-500">Tipo de Almacén</label>
                        <select [(ngModel)]="newLoc.type" class="select select-bordered w-full">
                            <option value="Central">Central</option>
                            <option value="Secundario">Secundario</option>
                        </select>
                    </div>
                     <div class="form-control">
                        <label class="label text-xs font-bold text-gray-500">Código Interno</label>
                        <input type="text" [(ngModel)]="newLoc.internalCode" class="input input-bordered w-full" />
                    </div>
                </div>

                <div class="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end rounded-b-lg">
                    <button class="btn btn-primary text-white" (click)="save()">Guardar registro</button>
                    <button class="btn btn-ghost" (click)="closeDialog()">Cancelar</button>
                </div>
            </div>
        </div>
       }
    </div>
  `
})
export class LocationsComponent {
  private configService = inject(ConfigurationService);
  locations = this.configService.locations;

  showDialog = signal(false);
  
  newLoc: Omit<LocationConfig, 'id'> = {
      name: '',
      warehouseName: '',
      type: 'Secundario',
      address: '',
      phone: '',
      responsible: '',
      internalCode: ''
  };

  openDialog() {
      this.resetForm();
      this.showDialog.set(true);
  }

  closeDialog() {
      this.showDialog.set(false);
  }

  save() {
      if (this.newLoc.name && this.newLoc.warehouseName) {
          this.configService.addLocation(this.newLoc);
          this.closeDialog();
      } else {
          alert('Nombre de Sede y Almacén requeridos.');
      }
  }

  resetForm() {
      this.newLoc = {
          name: '',
          warehouseName: '',
          type: 'Secundario',
          address: '',
          phone: '',
          responsible: '',
          internalCode: ''
      };
  }
}
