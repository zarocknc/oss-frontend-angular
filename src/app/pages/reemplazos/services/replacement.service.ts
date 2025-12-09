import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { EmployeeService } from '../../empleados/services/employee.service';
import { AsignacionService } from '../../asignaciones/services/asignacion.service';
import { ActivoService } from '../../asignaciones/services/activo.service';

// Re-export or map types to match Component expectations if needed, 
// or update Component to use shared types. For now, adapting to match Component.

export interface Employee {
  id: string;
  name: string;
  email: string;
  dni: string;
}

export interface Asset {
  id: string;
  assignmentId?: string;
  type: string;
  brand: string;
  model: string;
  series: string;
  state: string;
  status: string;
  location?: string;
  inventoryCode?: string;
  gama?: string;
}

export interface ReplacementRecord {
  id: string;
  date: string;
  ticket: string;
  employee: Employee;
  originalAsset: Asset;
  newAsset: Asset;
  originalAssetId: string; // for compatibility if needed
  newAssetId: string;      // for compatibility if needed
  reason: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  reportUrl?: string; // URL to the technical report
}

@Injectable({
  providedIn: 'root'
})
export class ReplacementService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private employeeService = inject(EmployeeService);
  private asignacionService = inject(AsignacionService);
  private activoService = inject(ActivoService);

  // Search Employee using EmployeeService
  searchEmployee(query: string): Observable<Employee | null> {
    // Adapter for EmployeeService returning any[] or specific DTO
    // Passing empty string for locationFilter as it's required by the service signature but we don't filter by location here
    return this.employeeService.searchEmployees(query, '').pipe(
      map((employees: any[]) => {
        if (!employees || employees.length === 0) return null;
        // Map backend Employee to local interface
        const emp = employees[0]; 
        return {
          id: emp.id.toString(),
          name: emp.nombreCompleto || `${emp.nombre} ${emp.apellidoPaterno}`,
          email: emp.email,
          dni: emp.codigoEmpleado
        };
      })
    );
  }

  // Get Assigned Assets using AsignacionService
  getAssignedAssets(employeeId: string): Observable<Asset[]> {
    return this.asignacionService.getAsignacionesActivasPorEmpleado(employeeId).pipe( 
        map(asignaciones => {
             return asignaciones
                .map(a => ({
                    id: a.dispositivo.id.toString(),
                    assignmentId: a.id.toString(),
                    type: a.dispositivo.tipoDispositivo.nombre,
                    brand: a.dispositivo.marca.nombre,
                    model: a.dispositivo.modelo,
                    series: a.dispositivo.numeroSerie,
                    state: 'Usado',
                    status: 'assigned',
                    inventoryCode: a.dispositivo.codigoActivo
                }));
        })
    );
  }

  // Updated to accept filters to match usage in AssetSelectionDialogComponent
  getAvailableAssets(filters?: any): Observable<Asset[]> {
    // Passing empty string for 'perfil' as required by ActivoService
    return this.activoService.getActivosDisponibles('').pipe(
        map(activos => {
            let mappedAssets = activos.map(a => ({
                id: a.id.toString(),
                type: a.tipoEquipo,
                brand: a.marca,
                model: a.modelo,
                series: a.serie,
                state: a.estado || 'Bueno',
                status: 'available',
                inventoryCode: a.codigoInventario,
                gama: a.gama,
                location: 'Principal' // Default or missing
            }));

            // Client-side filtering if filters are provided
            if (filters) {
                if (filters.type) {
                  mappedAssets = mappedAssets.filter(a => a.type === filters.type);
                }
                if (filters.search) {
                  const search = filters.search.toLowerCase();
                  mappedAssets = mappedAssets.filter(a => 
                    a.model.toLowerCase().includes(search) || 
                    a.series.toLowerCase().includes(search)
                  );
                }
            }
            return mappedAssets;
        })
    );
  }

  confirmReplacement(data: any): Observable<any> {
    // 1. Create Replacement Request
    const requestPayload = {
      asignacionOriginalId: +data.originalAsset.assignmentId,
      dispositivoReemplazoId: +data.newAsset.id,
      motivoReemplazoId: 1, // 1 = Falla HW (Hardcoded)
      usuarioRegistraId: 1, // Hardcoded
      descripcionMotivo: data.observations || 'Reemplazo solicitado desde web'
    };

    return this.http.post<any>(`${this.apiUrl}/reemplazos`, requestPayload).pipe(
      // 2. Execute immediately
      switchMap(createdRequest => {
        return this.http.post(`${this.apiUrl}/reemplazos/${createdRequest.id}/ejecutar`, {});
      })
    );
  }

  getHistory(): Observable<ReplacementRecord[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reemplazos`).pipe(
      map(replacements => replacements.map(r => ({
        id: r.id.toString(),
        date: r.fechaRegistro,
        ticket: 'N/A', // Backend might not have ticket, placeholder
        employee: {
          id: r.asignacionOriginal?.empleado?.id.toString(),
          name: `${r.asignacionOriginal?.empleado?.nombre} ${r.asignacionOriginal?.empleado?.apellidoPaterno}`,
          email: r.asignacionOriginal?.empleado?.email,
          dni: r.asignacionOriginal?.empleado?.codigoEmpleado
        },
        originalAsset: {
          id: r.asignacionOriginal?.dispositivo?.id.toString(),
          type: r.asignacionOriginal?.dispositivo?.tipoDispositivo?.nombre,
          brand: r.asignacionOriginal?.dispositivo?.marca?.nombre,
          model: r.asignacionOriginal?.dispositivo?.modelo,
          series: r.asignacionOriginal?.dispositivo?.numeroSerie,
          state: 'Reemplazado',
          status: 'replaced'
        },
        newAsset: {
          id: r.dispositivoReemplazo?.id.toString(),
          type: r.dispositivoReemplazo?.tipoDispositivo?.nombre,
          brand: r.dispositivoReemplazo?.marca?.nombre,
          model: r.dispositivoReemplazo?.modelo,
          series: r.dispositivoReemplazo?.numeroSerie,
          state: 'Asignado',
          status: 'assigned'
        },
        originalAssetId: r.asignacionOriginal?.dispositivo?.id.toString(),
        newAssetId: r.dispositivoReemplazo?.id.toString(),
        reason: r.descripcionMotivo,
        status: r.estadoReemplazo === 'EJECUTADO' ? 'Completed' : 'Pending',
        reportUrl: '#'
      })))
    );
  }
}
