import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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

export interface DispositivoEstadoRequest {
  estadoId: number;
  observacion: string;
}

export const ASSET_STATUS_MAP: Record<AssetStatus, number> = {
  'Disponible': 1,
  'Asignado': 2,
  'En mantenimiento': 3,
  'Baja': 4
};

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
    const statusId = ASSET_STATUS_MAP[newStatus];
    if (!statusId) {
      console.error(`Status ID not found for ${newStatus}`);
      return;
    }

    const payload: DispositivoEstadoRequest = {
      estadoId: statusId,
      observacion: observation
    };

    this.http.patch(`${this.apiUrl}/dispositivos/${id}/estado`, payload).subscribe({
      next: () => {
        // Optimistic update
        this._assets.update(items => items.map(a => {
          if (a.id === id) {
            return { 
              ...a, 
              status: newStatus, 
              observation: observation || a.observation 
            };
          }
          return a;
        }));
      },
      error: (err) => {
        console.error('Error updating asset status', err);
        // Here we could revert the optimistic update if we had applied it before the request
        // Since we apply it in 'next', no revert needed, but user sees no change if fails.
        // Ideally show a toast/alert.
      }
    });
  }

  addAssets(newAssets: any[]): Observable<any> {
    const requests = newAssets.map(asset => {
        const payload: DispositivoRequest = {
            codigoActivo: asset.invCode,
            numeroSerie: asset.series,
            tipoDispositivoId: asset.tipoDispositivoId,
            marcaId: asset.marcaId,
            modelo: asset.model,
            especificaciones: `${asset.processor || ''} ${asset.ram || ''}`.trim(),
            fechaAdquisicion: asset.fechaAdquisicion,
            valorAdquisicion: asset.valorAdquisicion,
            proveedorId: asset.proveedorId,
            observaciones: asset.observation,
            estadoDispositivoId: 1 // Disponible by default
        };
        console.log('Sending payload:', payload);
        
        return this.http.post<any>(`${this.apiUrl}/dispositivos`, payload).pipe(
            map(res => ({ success: true, data: res })),
            catchError(err => {
                console.error('API Error for asset:', asset.invCode, err);
                return of({ success: false, error: err });
            })
        );
    });

    return forkJoin(requests).pipe(
        map(results => {
            const successes = results.filter(r => r.success).length;
            const failures = results.filter(r => !r.success).length;
            this.loadAssets(); // Refresh list always
            return { count: successes, errors: failures, results };
        })
    );
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

export interface DispositivoRequest {
    codigoActivo: string;
    numeroSerie: string;
    tipoDispositivoId: number;
    marcaId: number;
    modelo: string;
    especificaciones: string;
    fechaAdquisicion: string;
    valorAdquisicion: number;
    proveedorId: number;
    observaciones: string;
    estadoDispositivoId: number;
}
