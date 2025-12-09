import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CatalogItem {
  id: number;
  nombre: string;
  codigo?: string;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getMarcas(): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(`${this.apiUrl}/catalogos/marcas/activas`);
  }

  getTipos(): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(`${this.apiUrl}/catalogos/tipos-dispositivo/activos`);
  }

  getProveedores(): Observable<CatalogItem[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogos/proveedores/activos`).pipe(
      map(items => items.map(item => ({
        ...item,
        nombre: item.razonSocial // Map razonSocial to nombre
      })))
    );
  }

  getSedes(): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(`${this.apiUrl}/catalogos/sedes/activas`);
  }
}
