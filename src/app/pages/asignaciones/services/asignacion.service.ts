import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AsignacionRequest {
  dispositivoId: number;
  empleadoId: number;
  fechaAsignacion: string; // "YYYY-MM-DD"
  observacionesAsignacion: string;
  usuarioAsignaId: number;
}

export interface AsignacionResponse {
  id: number;
  dispositivo: {
    id: number;
    numeroSerie: string;
    tipoDispositivo: { nombre: string };
    marca: { nombre: string };
    modelo: string;
  };
  empleado: {
    id: number;
    nombreCompleto: string;
  };
  fechaAsignacion: string;
  estadoAsignacion: { nombre: string; codigo: string };
  observacionesAsignacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  crearAsignacion(request: AsignacionRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/asignaciones`, request);
  }

  getHistorial(): Observable<AsignacionResponse[]> {
    return this.http.get<AsignacionResponse[]>(`${this.apiUrl}/asignaciones`);
  }
}
