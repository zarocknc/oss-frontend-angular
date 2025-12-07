import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Activo } from '../interfaces/activo.interface';

@Injectable({
  providedIn: 'root'
})
export class ActivoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  getActivosDisponibles(perfil: string): Observable<Activo[]> {
    // 'perfil' logic was simulated filtering, backend might handle this or we filter client-side 
    // For now getting all available assets
    return this.http.get<any[]>(`${this.apiUrl}/dispositivos/disponibles`).pipe(
        map((assets: any[]) => assets.map((a: any) => ({
            id: a.id.toString(),
            serie: a.numeroSerie,
            codigoInventario: a.codigoActivo,
            tipoEquipo: a.tipoDispositivo?.nombre || 'Desconocido',
            marca: a.marca?.nombre || 'Generico',
            modelo: a.modelo,
            estado: a.estadoDispositivo?.nombre || 'Disponible',
            gama: 'Media' // API doesn't have gama yet, default to 'Media'
        } as Activo)))
    );
  }
}
