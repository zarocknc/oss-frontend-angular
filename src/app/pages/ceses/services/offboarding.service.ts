import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type TerminationStatus = 'En Proceso' | 'Pendiente' | 'Finalizado';

export interface AssignedAsset {
  id: string; // Asset ID
  type: string;
  model: string;
  series: string;
  status: 'Asignado' | 'Devuelto';
}

export interface TerminationProcess {
  id: string; // Request ID
  employeeName: string;
  employeeEmail: string;
  employeeDni: string;
  employeePosition: string; 
  employeeArea: string;
  location: string;
  terminationDate: string;
  registrationDate: string;
  status: TerminationStatus;
  assets: AssignedAsset[];
}

import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OffboardingService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // State signal to keep UI happy (mocked or empty for now)
  private _processes = signal<TerminationProcess[]>([]);
  processes = this._processes.asReadonly();

  searchProcesses(filters: { status?: string, location?: string, query?: string }): TerminationProcess[] {
     // Return empty or filter local state if we populated it
     return this._processes(); 
  }

  // 1. Helper to find an existing PENDING request for an employee
  private getOpenRequest(employeeId: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/solicitudes-devolucion/pendientes`).pipe(
      map(list => list.find(req => req.empleado.id === +employeeId)) // Ensure ID matching is correct (number vs string)
    );
  }

  // 2. The Main Action: "Marcar Devolución" in your UI
  returnAsset(employeeId: string, assetId: string, conditionId: number = 1) { // 1 = Good/Bueno default
    return this.getOpenRequest(employeeId).pipe(
      switchMap(existingRequest => {
        // Step A: If no open request exists, create one
        if (!existingRequest) {
          const newRequest = {
            empleadoId: +employeeId, // Assuming backend expects a number
            fechaTerminoEmpleado: new Date().toISOString().split('T')[0], // Today, or derived from input if available
            fechaDevolucionProgramada: new Date().toISOString().split('T')[0],
            usuarioSolicitaId: 1 // Hardcoded admin for now
          };
          return this.http.post<any>(`${this.apiUrl}/solicitudes-devolucion`, newRequest);
        }
        return of(existingRequest); // Return as observable to match the stream
      }),
      switchMap(request => {
        // Step B: Add the specific asset to the request details
        const detailPayload = {
          solicitudDevolucionId: request.id,
          dispositivoId: +assetId,
          condicionDevolucionId: conditionId, // You might need a dropdown for this in UI
          observaciones: "Devolución registrada desde Frontend"
        };
        return this.http.post(`${this.apiUrl}/detalles-devolucion`, detailPayload);
      })
    );
  }
  
  // 3. Finalize: Call this if all assets are returned (optional trigger)
  completeProcess(requestId: number) {
    return this.http.post(`${this.apiUrl}/solicitudes-devolucion/${requestId}/completar`, {});
  }

  // Adapter for the UI which expects "markAssetAsReturned"
  // Assuming processId is the RequestId
  markAssetAsReturned(processId: string, assetId: string) {
     const detailPayload = {
          solicitudDevolucionId: +processId, // Convert to number
          dispositivoId: +assetId, // Convert to number
          condicionDevolucionId: 1, // Good
          observaciones: "Devolución registrada desde Frontend (Legacy UI)"
     };
     return this.http.post(`${this.apiUrl}/detalles-devolucion`, detailPayload);
  }
}
