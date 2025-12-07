import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AssignedAsset {
  id: string;
  type: string; // Laptop, Monitor
  model: string;
  series: string;
  state: 'Nuevo' | 'Usado' | 'Malo';
  gama?: string;
}

export interface Employee {
  id: string;
  dni: string;
  name: string;
  email: string;
  position: string; // Cargo/Puesto
  area: string;
  location: string; // Sede: San Borja, etc
  startDate: string; // Fecha Ingreso
  profile: string; // Perfil (Empleado, Externo, etc)
  avatarUrl?: string;
  status: 'active' | 'terminated';
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private _employees = signal<Employee[]>([]);
  employees = this._employees.asReadonly();
  
  // Mock Asset Assignments - keeping this mock for now as it requires a separate endpoint logic 
  // or chaining to get assigned assets for all employees, which might be heavy.
  // Ideally, this should be fetched on demand per employee or via a composite endpoint.
  private _assets = signal<{ [employeeId: string]: AssignedAsset[] }>({});

  constructor() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.http.get<any[]>(`${this.apiUrl}/empleados`).pipe(
      map((apiEmployees: any[]) => apiEmployees.map((e: any) => this.mapApiToEmployee(e)))
    ).subscribe({
      next: (data: Employee[]) => this._employees.set(data),
      error: (e: unknown) => console.error('Error loading employees', e)
    });
  }

  searchEmployees(query: string, locationFilter: string): Observable<Employee[]> {
    const params: any = {
      q: query,
      size: 10 // Default size, could be parameterized
    };
    
    // API might not support location filtering in the search endpoint directly based on requirements.
    // If it does not, we might need to filter client side or backend needs parameter.
    // Assuming backend 'search' typically takes 'q'. 
    // If 'locationFilter' is needed, we should pass it if backend supports it.
    // Based on user request "Mapea los parámetros q (query) y size correctamente", it implies these are the supported ones.
    // We can filter by location client-side after fetch if backend doesn't support it, 
    // OR pass it if we knew the param name (e.g. 'sedeId' or 'location').
    // Let's implement client-side filtering wrapper for now if backend only supports text search, 
    // OR just pass 'q' and 'size' as requested. 
    // However, the component expects filtered results. 
    // Let's assume we pass 'q' and then filter by location if needed locally, OR 
    // if the requirement implies just fetching, we fetch.
    
    // User said: "Mapea los parámetros q (query) y size correctamente."
    
    return this.http.get<any>(`${this.apiUrl}/empleados/search`, { params }).pipe(
      map(response => {
        // Response is PageEmpleadoResponse, so we need to access .content
        const apiEmployees = response.content || []; 
        return apiEmployees.map((e: any) => this.mapApiToEmployee(e));
      }),
      map((employees: Employee[]) => {
        if (locationFilter) {
          return employees.filter(e => e.location === locationFilter);
        }
        return employees;
      })
    );
  }

  getEmployeeAssets(employeeId: string): AssignedAsset[] {
    return this._assets()[employeeId] || [];
  }

  addEmployee(employee: any): Observable<Employee> {
    return this.http.post<any>(`${this.apiUrl}/empleados`, employee).pipe(
      map(response => this.mapApiToEmployee(response)),
      tap(newEmp => {
         this._employees.update(current => [...current, newEmp]);
      })
    );
  }

  private mapApiToEmployee(apiEmp: any): Employee {
      return {
          id: apiEmp.id.toString(),
          dni: apiEmp.codigoEmpleado, // Assuming code is used as DNI/Identifier or we need a DNI field? API has 'codigoEmpleado'
          name: `${apiEmp.nombre} ${apiEmp.apellidoPaterno} ${apiEmp.apellidoMaterno || ''}`.trim(),
          email: apiEmp.email || '',
          position: apiEmp.puesto?.nombre || 'Desconocido',
          area: apiEmp.area?.nombre || 'Desconocido',
          location: apiEmp.sede?.nombre || 'Desconocido',
          startDate: apiEmp.fechaIngreso,
          profile: 'Empleado', // Defaulting as API doesn't seem to have profile type explicitly in response yet or it's 'estado'?
          status: apiEmp.estadoEmpleado?.nombre === 'Activo' ? 'active' : 'terminated'
      };
  }
}
