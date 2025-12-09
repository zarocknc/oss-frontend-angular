import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { SeriesEntryDialogComponent } from './components/series-entry-dialog/series-entry-dialog.component';
import { InventoryService, InventoryAsset } from '../inventario/services/inventory.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, SeriesEntryDialogComponent],
  template: `
    <div class="p-6 max-w-[1600px] mx-auto h-[calc(100vh-64px)] flex flex-col space-y-6">
       
       <!-- Header -->
       <div class="flex justify-between items-center bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
         <div>
            <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
               Stock Ingreso y Control de Equipamiento
            </h1>
            <p class="text-gray-500 mt-1">Gestione el ingreso masivo de activos y visualice el historial de compras.</p>
         </div>
         
         <button class="btn btn-primary text-white shadow-lg shadow-blue-200 gap-2" (click)="openDialog()">
            <lucide-icon name="boxes" size="20"></lucide-icon>
            Agregar stock Nuevo
         </button>
       </div>

       <!-- Content: Empty State or History Mock -->
       <div class="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
            
            <div class="max-w-md space-y-4">
                <div class="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-6">
                    <lucide-icon name="package-check" size="48"></lucide-icon>
                </div>
                
                <h2 class="text-xl font-bold text-gray-800">Listo para registrar ingresos</h2>
                <p class="text-gray-500 leading-relaxed">
                    Utilice el botón superior para registrar nuevos lotes de equipos. 
                    Puede ingresarlos manualmente o importando una lista de Excel.
                </p>
                
                <div class="divider">Historial Reciente (Demo)</div>
                
                <!-- Simple mocked list for feel -->
                <div class="w-full text-left space-y-2">
                    <div class="p-3 border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <div class="flex items-center gap-3">
                             <div class="badge badge-neutral">GR-00255</div>
                             <div>
                                <div class="font-bold text-gray-700">Lote Lenovo T440</div>
                                <div class="text-xs text-gray-400">10 unidades • 10/11/2025</div>
                             </div>
                        </div>
                        <span class="text-green-600 text-xs font-bold">PROCESADO</span>
                    </div>
                     <div class="p-3 border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <div class="flex items-center gap-3">
                             <div class="badge badge-neutral">GR-00251</div>
                             <div>
                                <div class="font-bold text-gray-700">Monitores Dell</div>
                                <div class="text-xs text-gray-400">5 unidades • 01/11/2025</div>
                             </div>
                        </div>
                        <span class="text-green-600 text-xs font-bold">PROCESADO</span>
                    </div>
                </div>
            </div>

       </div>

       <!-- Dialog -->
       @if (showDialog()) {
           <app-series-entry-dialog
             (close)="closeDialog()"
             (save)="handleSaveAssets($event)"
           ></app-series-entry-dialog>
       }
    </div>
  `
})
export class StockComponent {
  private inventoryService = inject(InventoryService);
  
  showDialog = signal(false);

  openDialog() {
    this.showDialog.set(true);
  }

  closeDialog() {
    this.showDialog.set(false);
  }

  handleSaveAssets(assets: any[]) {
      this.inventoryService.addAssets(assets).subscribe({
        next: (res) => {
            this.closeDialog();
            alert(`Proceso finalizado. Se crearon ${res.count} activos correctamente.`);
        },
        error: (err) => {
            alert('Ocurrió un error al guardar los activos. Revise la consola.');
            console.error(err);
        }
      });
  }
}
