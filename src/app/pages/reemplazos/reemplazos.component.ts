import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Search, Calendar, FileText, ChevronRight } from 'lucide-angular';
import { ReplacementService, Employee, Asset } from './services/replacement.service';
import { AssetSelectionDialogComponent } from './components/asset-selection-dialog/asset-selection-dialog.component';

@Component({
  selector: 'app-reemplazos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, AssetSelectionDialogComponent],
  template: `
    <div class="p-6 max-w-[1600px] mx-auto space-y-6">
      <!-- Top Header -->
      <div class="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
           Módulo Reemplazos
        </h1>
        <a routerLink="historial" class="btn btn-primary btn-sm text-white gap-2 shadow-md">
          Historial de Reemplazos
          <lucide-icon name="chevron-right" [size]="16"></lucide-icon>
        </a>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Left Column: Form -->
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
          <div class="space-y-6">
            
            <!-- Employee Search -->
             <div class="form-control">
              <label class="label font-bold text-gray-700">Empleado Afectado</label>
              <div class="relative">
                <input 
                  type="text" 
                  placeholder="Ingrese Dni o Email" 
                  class="input input-bordered w-full pr-10 focus:ring-2 focus:ring-blue-500" 
                  [(ngModel)]="employeeQuery"
                  (keyup.enter)="searchEmployee()"
                />
                <button 
                  class="absolute right-2 top-2 btn btn-xs btn-ghost text-gray-400 hover:text-blue-600"
                  (click)="searchEmployee()"
                >
                  <lucide-icon name="search" [size]="18"></lucide-icon>
                </button>
              </div>
              @if (selectedEmployee()) {
                <div class="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded flex items-center">
                  <span class="font-semibold mr-2">✓</span> {{ selectedEmployee()?.name }}
                </div>
              } @else if (searchPerformed && !selectedEmployee()) {
                 <div class="mt-2 text-sm text-red-500">Empleado no encontrado</div>
              }
            </div>

            <!-- Date -->
            <div class="form-control">
              <label class="label font-bold text-gray-700">Fecha</label>
              <div class="relative">
                <input type="date" class="input input-bordered w-full" [(ngModel)]="formData.date" />
              </div>
            </div>

            <!-- Ticket -->
            <div class="form-control">
              <label class="label font-bold text-gray-700">Ticket</label>
              <input type="text" placeholder="Ingrese ticket de atención" class="input input-bordered w-full" [(ngModel)]="formData.ticket" />
            </div>

             <!-- File -->
            <div class="form-control">
              <label class="label font-bold text-gray-700">Informe Tecnico (PDF/Word)</label>
              <div class="join w-full">
                <button class="btn join-item bg-gray-200 border-gray-300">Seleccionar archivo</button>
                <div class="bg-gray-50 border border-gray-300 join-item w-full flex items-center px-4 text-gray-400 text-sm">
                  Ningun Archivo...
                </div>
              </div>
            </div>

             <!-- Observaciones -->
            <div class="form-control">
              <label class="label font-bold text-gray-700">Observaciones</label>
              <textarea class="textarea textarea-bordered h-24" [(ngModel)]="formData.observations"></textarea>
            </div>

          </div>
        </div>

        <!-- Right Column: Assets -->
        <div class="space-y-6">
          
          <!-- Assigned Assets -->
          <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Equipos Asignados al Empleado</h2>
            
            @if (assignedAssets().length > 0) {
              <div class="overflow-x-auto">
                <table class="table w-full">
                  <thead>
                    <tr class="bg-gray-50 text-gray-600">
                      <th>Equipo</th>
                      <th>Modelo</th>
                      <th>Serie</th>
                      <th>Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (asset of assignedAssets(); track asset.id) {
                      <tr>
                        <td class="font-bold text-gray-700">{{ asset.type }}</td>
                        <td>{{ asset.model }}</td>
                        <td class="font-mono text-sm">{{ asset.series }}</td>
                        <td>
                          <button 
                            class="btn btn-sm btn-primary text-white"
                            (click)="initiateReplacement(asset)"
                            [disabled]="isAssetBeingReplaced(asset)"
                          >
                            Reemplazar
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <div class="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border-dashed border-2 border-gray-200">
                @if (selectedEmployee()) {
                   No tiene equipos asignados
                } @else {
                   Busque un empleado para ver sus equipos
                }
               
              </div>
            }
          </div>

          <!-- Pending Replacement / Available Asset -->
          @if (assetToReplace()) {
             <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 animate-in fade-in slide-in-from-bottom-4">
              <h2 class="text-xl font-bold text-gray-800 mb-4">Equipo disponible para el reemplazo</h2>
              
              @if (replacementAsset()) {
                <div class="overflow-x-auto mb-6">
                  <table class="table w-full bg-blue-50 rounded-lg">
                    <thead>
                      <tr class="text-gray-600">
                        <th>Equipo</th>
                        <th>Modelo</th>
                        <th>Serie</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="font-bold">{{ replacementAsset()?.type }}</td>
                        <td>{{ replacementAsset()?.model }}</td>
                        <td class="font-mono">{{ replacementAsset()?.series }}</td>
                        <td>
                           <span class="badge badge-success">{{ replacementAsset()?.state }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="flex gap-4 justify-end">
                  <button class="btn btn-error text-white" (click)="cancelReplacement()">Cancelar Reemplazo</button>
                  <button class="btn btn-primary text-white" (click)="confirmReplacement()">Confirmar Reemplazo</button>
                </div>
              } @else {
                 <div class="p-4 bg-yellow-50 text-yellow-700 rounded-lg flex justify-between items-center">
                   <span>Seleccione un equipo de reemplazo para <b>{{ assetToReplace()?.model }}</b></span>
                   <button class="btn btn-sm btn-outline btn-warning" (click)="openSelectionDialog()">Seleccionar</button>
                 </div>
              }
            </div>
          }

        </div>
      </div>
    </div>

    <!-- Simple Dialog Integration -->
    @if (showDialog()) {
      <app-asset-selection-dialog 
        (cancel)="closeDialog()"
        (confirm)="onAssetSelected($event)"
      ></app-asset-selection-dialog>
    }
  `
})
export class ReplacementComponent {
  private replacementService = inject(ReplacementService);

  // Form State
  employeeQuery = '';
  selectedEmployee = signal<Employee | null>(null);
  searchPerformed = false;

  formData = {
    date: new Date().toISOString().split('T')[0],
    ticket: '',
    observations: ''
  };

  // Assets State
  assignedAssets = signal<Asset[]>([]);
  
  // Replacement Logic State
  assetToReplace = signal<Asset | null>(null); // The original asset selected for replacement
  replacementAsset = signal<Asset | null>(null); // The new asset selected from dialog
  
  showDialog = signal(false);

  searchEmployee() {
    this.searchPerformed = true;
    const emp = this.replacementService.searchEmployee(this.employeeQuery);
    if (emp) {
      this.selectedEmployee.set(emp);
      this.assignedAssets.set(this.replacementService.getAssignedAssets(emp.id));
      // Reset replacement state if employee changes?
      this.cancelReplacement();
    } else {
      this.selectedEmployee.set(null);
      this.assignedAssets.set([]);
    }
  }

  initiateReplacement(asset: Asset) {
    this.assetToReplace.set(asset);
    this.replacementAsset.set(null); // Reset choice
    this.openSelectionDialog();
  }

  isAssetBeingReplaced(asset: Asset): boolean {
    return this.assetToReplace()?.id === asset.id;
  }

  openSelectionDialog() {
    this.showDialog.set(true);
  }

  closeDialog() {
    this.showDialog.set(false);
    // If no asset was selected and we just closed, maybe we shouldn't cancel the whole flow?
    // User might just be closing the popup to look at something. 
    // But if they didn't select anything, we still have `assetToReplace` set, so the UI shows the yellow box "Seleccione..."
  }

  onAssetSelected(asset: Asset) {
    this.replacementAsset.set(asset);
    this.showDialog.set(false);
  }

  cancelReplacement() {
    this.assetToReplace.set(null);
    this.replacementAsset.set(null);
  }

  confirmReplacement() {
    if (this.selectedEmployee() && this.assetToReplace() && this.replacementAsset()) {
      this.replacementService.createReplacement({
        date: this.formData.date,
        ticket: this.formData.ticket,
        employee: this.selectedEmployee()!,
        originalAsset: this.assetToReplace()!,
        newAsset: this.replacementAsset()!,
        observations: this.formData.observations,
        reportUrl: '#'
      });
      // Reset
      alert('Reemplazo confirmado exitosamente');
      this.cancelReplacement();
      this.formData.ticket = '';
      this.formData.observations = '';
      // Refresh assets? In mock, we pushed updates.
    }
  }
}
