import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReplacementService, Asset } from '../../services/replacement.service';
import { LucideAngularModule, Search } from 'lucide-angular';

@Component({
  selector: 'app-asset-selection-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">Seleccionar equipo de reemplazo</h2>
          <p class="text-sm text-gray-500 mt-1">
            Active a reemplazar: <span class="font-medium text-gray-700">{{ activeAsset()?.type }} {{ activeAsset()?.model }} {{ activeAsset()?.series }}</span>
          </p>
        </div>

        <!-- Filters -->
        <div class="p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Almacen</label>
            <select [(ngModel)]="filters.location" class="select select-bordered select-sm w-full bg-white">
              <option value="">Todos</option>
              <option value="San Isidro">San Isidro</option>
              <option value="Miraflores">Miraflores</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Serie</label>
            <input type="text" [(ngModel)]="filters.series" class="input input-bordered input-sm w-full bg-white" placeholder="Buscar serie..." />
          </div>
           <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
             <select [(ngModel)]="filters.state" class="select select-bordered select-sm w-full bg-white">
              <option value="">Todos</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Usado">Usado</option>
            </select>
          </div>
           <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Modelo</label>
             <input type="text" [(ngModel)]="filters.model" class="input input-bordered input-sm w-full bg-white" placeholder="Modelo..." />
          </div>
          <div class="flex gap-2">
            <button (click)="search()" class="btn btn-primary btn-sm flex-1 text-white">
              Buscar
            </button>
             <button (click)="onCancel()" class="btn btn-ghost btn-sm text-red-600">
              Cancelar
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="flex-1 overflow-auto p-4">
          <table class="table table-sm table-pin-rows w-full">
            <thead>
              <tr class="bg-gray-100 text-gray-600">
                <th></th>
                <th>Almacen</th>
                <th>Equipo</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Serie</th>
                <th>Inv.</th>
                <th>Estado</th>
                <th>Gama</th>
              </tr>
            </thead>
            <tbody>
              @for (asset of availableAssets(); track asset.id) {
                <tr class="hover:bg-blue-50 cursor-pointer" [class.bg-blue-100]="selectedAsset()?.id === asset.id" (click)="selectAsset(asset)">
                  <td>
                    <input type="radio" name="asset_select" class="radio radio-primary radio-xs" [checked]="selectedAsset()?.id === asset.id" />
                  </td>
                  <td>{{ asset.location }}</td>
                  <td>{{ asset.type }}</td>
                  <td>{{ asset.brand }}</td>
                  <td>{{ asset.model }}</td>
                  <td>{{ asset.series }}</td>
                  <td>{{ asset.inventoryCode }}</td>
                  <td>
                     <span class="badge badge-sm" [ngClass]="{'badge-success': asset.state === 'Nuevo', 'badge-warning': asset.state === 'Usado'}">{{ asset.state }}</span>
                  </td>
                  <td>{{ asset.gama }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Footer -->
         <div class="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
             <button (click)="onCancel()" class="btn btn-ghost text-gray-600">Cancelar</button>
             <button (click)="onConfirm()" [disabled]="!selectedAsset()" class="btn btn-primary text-white">Reemplazar</button>
         </div>
      </div>
    </div>
  `
})
export class AssetSelectionDialogComponent {
  private replacementService = inject(ReplacementService);

  // Inputs
  activeAsset = signal<Asset | null>(null);

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Asset>();

  availableAssets = signal<Asset[]>([]);
  selectedAsset = signal<Asset | null>(null);

  filters = {
    location: '',
    series: '',
    state: '',
    model: ''
  };

  constructor() {
     // Initial load
     this.search();
  }

  setInputAsset(asset: Asset) {
    this.activeAsset.set(asset);
    // Determine filters based on asset type if needed, but for now show all compatible types?
    // User requirement just says "allows filtering".
    // I'll filter by same type automatically to be smart? The prompt says "allows filtering", doesn't imply auto-filter.
    // But logically you replace a Laptop with a Laptop.
    // I'll implement "search" to be manual mainly, but maybe pre-fill type if I had it in filters.
    this.search(); 
  }

  search() {
    this.availableAssets.set(this.replacementService.getAvailableAssets(this.filters));
  }

  selectAsset(asset: Asset) {
    this.selectedAsset.set(asset);
  }

  onCancel() {
    this.cancel.emit();
  }

  onConfirm() {
    if (this.selectedAsset()) {
      this.confirm.emit(this.selectedAsset()!);
    }
  }
}
