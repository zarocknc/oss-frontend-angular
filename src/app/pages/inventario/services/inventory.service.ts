import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export type AssetStatus = 'Disponible' | 'Asignado' | 'En mantenimiento' | 'Baja';

export interface InventoryAsset {
  id: string;
  assignmentId?: string;
  alm: string; // Almacen location
  type: string; // Equipo: Laptop, Monitor
  brand: string;
  model: string;
  series: string;
  invCode: string; // INV
  cmdbCode: string; // CMDB
  status: AssetStatus;
  observation: string;
  
  // Specs for Details Panel
  processor?: string;
  ram?: string;
  age?: string; // Antiguedad
  currentLocation?: string; // Ubicacion actual (puede ser diferente de ALM si está asignado)
  bookValue?: string; // Valor Contable
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // We can expose a readonly signal if components expect it, 
  // or switch components to use Observables/Resource API.
  // For now, let's keep the signal but populate it from API
  private _assets = signal<InventoryAsset[]>([]);
  assets = this._assets.asReadonly();

  constructor() {
    this.loadAssets();
  }

  loadAssets() {
    this.http.get<any[]>(`${this.apiUrl}/dispositivos`).pipe(
      map((apiAssets: any[]) => apiAssets.map((a: any) => this.mapApiToInventoryAsset(a)))
    ).subscribe({
      next: (data: InventoryAsset[]) => this._assets.set(data),
      error: (e: unknown) => console.error('Error loading assets', e)
    });
  }

  // KPIs
  stats = computed(() => {
    const list = this._assets();
    return {
      available: list.filter(a => a.status === 'Disponible').length,
      assigned: list.filter(a => a.status === 'Asignado').length,
      maintenance: list.filter(a => a.status === 'En mantenimiento').length,
      discharged: list.filter(a => a.status === 'Baja').length // Baja
    };
  });

  updateAssetStatus(id: string, newStatus: AssetStatus, observation: string) {
    // In a real app we'd call the API to update status
    // For now update local state to reflect UI change optimistically
     this._assets.update(items => items.map(a => {
        if (a.id === id) {
            return { ...a, status: newStatus, observation: observation || a.observation };
        }
        return a;
    }));
  }

  addAssets(newAssets: InventoryAsset[]) {
    // This would need a proper API endpoint for bulk creation or loop
    // For now, just a placeholder or single create if needed
    // this._assets.update(current => [...current, ...newAssets]);
  }

  getNextId(): string {
     // Not relevant if backend handles IDs
      return "0";
  }

  private mapApiToInventoryAsset(apiAsset: any): InventoryAsset {
    return {
      id: apiAsset.id.toString(),
      assignmentId: undefined, // Needs logic to fetch active assignment id if needed?
      alm: apiAsset.sede?.nombre || 'Desconocido',
      type: apiAsset.tipoDispositivo?.nombre || 'Otro',
      brand: apiAsset.marca?.nombre || 'Generico',
      model: apiAsset.modelo,
      series: apiAsset.numeroSerie,
      invCode: apiAsset.codigoActivo,
      cmdbCode: 'N/A', // Not in API response example
      status: apiAsset.estadoDispositivo?.nombre as AssetStatus || 'Disponible',
      observation: apiAsset.observaciones || '',
      processor: 'N/A', 
      ram: 'N/A',
      age: apiAsset.antiguedadEnAnios ? `${apiAsset.antiguedadEnAnios} años` : '0 años',
      currentLocation: apiAsset.sede?.nombre,
      bookValue: apiAsset.valorAdquisicion ? `S/. ${apiAsset.valorAdquisicion}` : 'S/. 0'
    };
  }
}
